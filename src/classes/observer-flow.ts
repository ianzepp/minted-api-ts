import _ from 'lodash';
import fs from 'fs';
import path from 'path';

// Classes
import { Filter } from '../classes/filter';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { Observer } from '../classes/observer';
import { System } from '../classes/system';

// Create the file list of observers
const OBSERVER_BASE = path.join(__dirname, '../observers');
const OBSERVER_LIST = fs.readdirSync(OBSERVER_BASE);

// Instantiate all of the default observers, sort by ring priority and then group by ring
const OBSERVERS = _.chain(OBSERVER_LIST)
    .map(observerPath => require(path.join(OBSERVER_BASE, observerPath)).default)
    .map(observerType => new observerType())
    .sortBy(observer => observer.onRingPriority())
    .groupBy(observer => observer.onRing())
    .value();

// Implementation
export class ObserverFlow {
    private observers: Observer[] = [];

    constructor(
        readonly system: System,
        readonly schema: Schema,
        readonly change: Record[],
        readonly filter: Filter,
        readonly op: string) {}

    toObservers(ring: number) {
        return _.get(OBSERVERS, ring) || [];
    }

    async run(ring: number) {
        // Filter down from the master observer list to only be the ones for this ring
        // Observers are already pre-sorted by rin priority
        let observers = this.toObservers(ring).filter(observer => {
            // Reject by schema
            if (observer.onSchema() !== this.schema.name && observer.onSchema() !== 'record') {
                return false;
            }

            // Anything that matched here returns `true`
            if (observer.onSelect() && this.op === 'select') {
                return true;
            }

            if (observer.onCreate() && this.op === 'create') {
                return true;
            }

            if (observer.onUpdate() && this.op === 'update') {
                return true;
            }

            if (observer.onUpsert() && this.op === 'upsert') {
                return true;
            }

            if (observer.onDelete() && this.op === 'delete') {
                return true;
            }

            // Done, no match?
            return false;
        });

        // Nothing to do?
        if (observers.length === 0) {
            return;
        }

        console.debug('ObserverFlow: executing ring %j with %j', ring, observers.map(o => o.toName()));

        // Walk and run
        for(let observer of observers) {
            console.debug('ObserverFlow: run %j', observer.toName());

            try {
                await observer.run(this);
            }

            catch (error) {
                if (observer.isFailable()) {
                    console.warn('ObserverFlow, failable error:', error);
                }

                else {
                    throw error;
                }
            }
        }

        // Done
    }

    //
    // Helpers
    //

    // private toObservers(): Observer[] {
    //     return _.compact(FLOWS.map(FlowType => {
    //         // Create the flow
    //         let flow = new FlowType(this.system, this);

    //         // Filter flows by schema type
    //         if (this.onSchema() !== flow.onSchema() && flow.onSchema() !== 'system__record') {
    //             return;
    //         }

    //         // Filter flows by operation
    //         if (this.isSelect() && flow.onSelect()) {
    //             return flow;
    //         }

    //         if (this.isCreate() && flow.onCreate()) {
    //             return flow;
    //         }

    //         if (this.isUpdate() && flow.onUpdate()) {
    //             return flow;
    //         }

    //         if (this.isUpsert() && flow.onUpsert()) {
    //             return flow;
    //         }

    //         if (this.isDelete() && flow.onDelete()) {
    //             return flow;
    //         }
    //     }));
    // }
}