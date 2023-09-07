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
import { SystemVerb } from '../classes/system-data';

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

    get change_map(): _.Dictionary<Record> {
        return _.keyBy(this.change, 'data.id');
    }

    get change_ids(): any[] {
        return _.compact(_.map(this.change, 'data.id'));
    }

    async run(ring: number): Promise<void> {
        // Get the master list of observers for this execution context
        let observers: Observer[] = []; 
        observers.push(... _.get(Observers, 'record') || []);
        observers.push(... _.get(Observers, this.schema.schema_name) || []);

        // Filter in a single loop
        observers = observers.filter(observer => {
            // Wrong ring?
            if (observer.onRing() != ring) {
                return false;
            }

            // Accept if the operation matches
            else if (observer.onCreate() && this.op == SystemVerb.Create) {
                return true;
            }

            else if (observer.onDelete() && this.op == SystemVerb.Delete) {
                return true;
            }

            else if (observer.onSelect() && this.op == SystemVerb.Select) {
                return true;
            }

            else if (observer.onUpdate() && this.op == SystemVerb.Update) {
                return true;
            }

            else if (observer.onUpsert() && this.op == SystemVerb.Upsert) {
                return true;
            }

            // No acceptable matches.
            else {
                return false;
            }
        });

        for(let observer of observers) {
            console.debug('ObserverFlow: schema=%j op=%j ring=%j rank=%j observer=%j', 
                this.schema.schema_name, 
                this.op, 
                observer.onRing(),
                observer.onRank(),
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

    fail(code: number, message: string, record?: Record): void {
        this.failures.push({
            code: code,
            message: message,
            record: record
        });
    }
}