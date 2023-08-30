import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';

// Classes
import { Filter } from '../classes/filter';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';
import { Schema } from '../classes/schema';
import { Observer } from '../classes/observer';
import { System } from '../classes/system';

// Import pre-loaded routers
import Observers from '../preloader/observers';

// Implementation
export interface ObserverFlowFailure {
    code: number;
    message: string;
    record?: RecordJson;
}

export class ObserverFlow {
    readonly failures: ObserverFlowFailure[] = [];

    constructor(
        readonly system: System,
        readonly schema: Schema,
        readonly change: Record[],
        readonly filter: Filter,
        readonly op: string) {}

    get schema_name() {
        return this.schema.schema_name;
    }

    get change_map() {
        return _.keyBy(this.change, 'data.id');
    }

    get change_ids() {
        return _.compact(_.map(this.change, 'data.id'));
    }

    get statement() {
        return this.system.knex.toStatement(this.schema_name);
    }

    async run(ring: number) {
        // Get the master list of observers for this execution context
        let observers: Observer[] = []; 
        observers.push(... _.get(Observers, 'record') || []);
        observers.push(... _.get(Observers, this.schema.schema_name) || []);

        // Filter in a single loop
        observers = observers.filter(observer => {
            // Wrong ring?
            if (observer.onRing() !== ring) {
                return false;
            }

            // Accept if the operation matches
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

            // No acceptable matches.
            return false;
        });

        for(let observer of observers) {
            console.debug('ObserverFlow: schema=%j op=%j ring=%j ring-priority=%j observer=%j', 
                this.schema.schema_name, 
                this.op, 
                observer.onRing(),
                observer.onRingPriority(),
                observer.toName()
            );

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
    }

    fail(code: number, message: string, record?: Record) {
        this.failures.push({
            code: code,
            message: message,
            record: record
        });
    }
}