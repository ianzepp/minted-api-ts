import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import chai from 'chai';

// Classes
import { Filter } from '../classes/filter';
import { Observer } from '../classes/observer';
import { Record } from '../classes/record';
import { Schema, SchemaType } from '../classes/schema';
import { System } from '../classes/system';

// Layouts
import { ObserverFlowFailure } from '../layouts/observer';
import { RecordJson } from '../layouts/record';
import { SystemVerb } from '../layouts/system';

// Import pre-loaded routers
import Observers from '../preloader/observers';


export class ObserverFlow {
    readonly expect = chai.expect;
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
        observers.push(... _.get(Observers, SchemaType.Record) || []);
        observers.push(... _.get(Observers, this.schema.schema_name) || []);

        // Filter in a single loop
        observers = observers.filter(observer => {
            // Wrong ring?
            if (observer.onRing() != ring) {
                return false;
            }

            // Accept if the operation matches
            if (observer.onSelect() && this.op == SystemVerb.Select) {
                return true;
            }

            if (observer.onCreate() && this.op == SystemVerb.Create) {
                return true;
            }

            if (observer.onUpdate() && this.op == SystemVerb.Update) {
                return true;
            }

            if (observer.onUpsert() && this.op == SystemVerb.Upsert) {
                return true;
            }

            if (observer.onExpire() && this.op == SystemVerb.Expire) {
                return true;
            }

            if (observer.onDelete() && this.op == SystemVerb.Delete) {
                return true;
            }

            // No acceptable matches.
            return false;
        });

        for(let observer of observers) {
            // console.debug('ObserverFlow: schema=%j op=%j ring=%j rank=%j observer=%j', 
            //     this.schema.schema_name, 
            //     this.op, 
            //     observer.onRing(),
            //     observer.onRank(),
            //     observer.toName()
            // );

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

        // Check for failurs
        if (this.failures.length === 0) {
            return;
        }

        throw this.failures;
    }

    fail(code: number, message: string, record?: Record): void {
        console.warn('ObserverFlow: FAIL %j message=%j record=%j', code, message, record);
        
        this.failures.push({
            code: code,
            message: message,
            record: record
        });
    }
}