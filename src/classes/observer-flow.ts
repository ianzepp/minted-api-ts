import _ from 'lodash';

// Classes
import { Filter } from '../classes/filter';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { Observer } from '../classes/observer';
import { ObserverRing } from '../classes/observer';
import { System } from '../classes/system';

// Hardcoded observers
const OBSERVER_TYPES: Array<typeof Observer> = [
    require('../observers/record.data-select').default,
    require('../observers/record.data-create').default,
];

// Implementation
export class ObserverFlow {
    private observers: Observer[] = [];

    constructor(
        readonly system: System,
        readonly schema: Schema,
        readonly change: Record[],
        readonly filter: Filter,
        readonly op: string) {}

    isSelect() {
        return this.op === 'select';
    }

    isCreate() {
        return this.op === 'create';
    }

    isUpdate() {
        return this.op === 'update';
    }

    isUpsert() {
        return this.op === 'upsert';
    }

    isDelete() {
        return this.op === 'delete';
    }

    async initialize() {
        OBSERVER_TYPES.forEach(ObserverType => {
            this.observers.push(new ObserverType(this.system, this));
        });

        // Sort the observers by priority
        // TODO
    }

    async run(ring: ObserverRing) {
        // Filter down from the master observer list to only be the ones for this ring
        let observers = this.observers.filter(observer => {
            // Reject by ring
            if (observer.onRing() !== ring) {
                return false;
            }

            // Reject by schema
            if (observer.onSchema() !== this.schema.name && observer.onSchema() !== 'record') {
                return false;
            }

            // Anything that matched here returns `true`
            if (observer.onSelect() && this.isSelect()) {
                return true;
            }

            if (observer.onCreate() && this.isCreate()) {
                return true;
            }

            if (observer.onUpdate() && this.isUpdate()) {
                return true;
            }

            if (observer.onUpsert() && this.isUpsert()) {
                return true;
            }

            if (observer.onDelete() && this.isDelete()) {
                return true;
            }

            // Done, no match?
            return false;
        });

        // Nothing to do?
        if (observers.length === 0) {
            return;
        }

        // Sort by ring priority
        // TODO

        console.debug('ObserverFlow(): executing %j with %j', ring, observers.map(o => o.toName()));

        // Walk and run
        for(let observer of observers) {
            try {
                await observer.run();
            }

            catch (error) {
                if (observer.isFailable()) {
                    console.warn('ObserverFlow(), failable error:', error);
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