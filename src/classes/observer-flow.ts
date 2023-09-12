import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import chai from 'chai';

// Classes
import { Filter } from '@classes/filter';
import { Observer } from '@classes/observer';
import { Record } from '@classes/record';
import { Schema } from '@classes/schema';
import { System } from '@classes/system';

// Layouts
import { ObserverFlowFailure } from '@layouts/observer';
import { RecordJson } from '@layouts/record';
import { SystemVerb } from '@layouts/system';

// Import pre-loaded routers
import Observers from '@preloader/observers';
import { fail } from 'assert';
import { DataError } from '@classes/system-data';


export class ObserverFlow {
    readonly expect = chai.expect;
    readonly failures: ObserverFlowFailure[] = [];

    constructor(
        readonly system: System,
        readonly schema: Schema,
        readonly change: Record[],
        readonly filter: Filter,
        readonly op: string) {}

    get change_data() {
        return _.map(this.change, 'data');
    }

    get change_meta() {
        return _.map(this.change, 'meta');
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
                await observer.startup(this);
                await observer.run(this);
                await observer.cleanup(this);
            }

            catch (error) {
                if (this.system.isTest() === false) {
                    console.error('ObserverFlow:', error.message);
                }

                if (error instanceof DataError) {
                    throw error;
                }

                throw new DataError(error);
            }
        }

        // Check for failurs
        if (this.failures.length === 0) {
            return;
        }

        throw this.failures;
    }
}