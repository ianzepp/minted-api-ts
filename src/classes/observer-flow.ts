import _ from 'lodash';
import fs from 'fs-extra';
import util from 'util';
import chai from 'chai';
import { expect } from 'chai';

// Classes
import { Filter } from '@classes/filter';
import { Observer } from '@classes/observer';
import { Record } from '@classes/record';
import { Schema } from '@classes/schema';
import { Kernel } from '@classes/kernel';

// Layouts
import { KernelVerb } from '@layouts/kernel';
import { ObserverFlowFailure } from '@layouts/observer';
import { RecordJson } from '@layouts/record';

// Import pre-loaded routers
import Observers from '@preloader/observers';
import { fail } from 'assert';
import { DataError } from '@classes/kernel-data';


export class ObserverFlow {
    readonly expect = chai.expect;
    readonly failures: string[] = [];

    constructor(
        readonly kernel: Kernel,
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
        let observers = Observers[ring] || [];

        // Filter in a single loop
        observers = observers.filter(observer => {
            //
            // Negetive checks
            //

            // Wrong client namespace?
            if (observer.onClient() != '*' && observer.onClient() !== this.kernel.user_ns) {
                return false;
            }

            // Wrong schema name?
            if (observer.onSchema() != '*' && observer.onSchema() !== this.schema.schema_name) {
                return false;
            }

            // Don't run for root?
            if (observer.onRoot() === false && this.kernel.isRoot()) {
                return false;
            }

            // Don't run for test cases?
            if (observer.onTest() === false && this.kernel.isTest()) {
                return false;
            }

            //
            // Positive checks
            //

            if (observer.onSelect() && this.op == KernelVerb.Select) {
                return true;
            }

            if (observer.onCreate() && this.op == KernelVerb.Create) {
                return true;
            }

            if (observer.onUpdate() && this.op == KernelVerb.Update) {
                return true;
            }

            if (observer.onUpsert() && this.op == KernelVerb.Upsert) {
                return true;
            }

            if (observer.onExpire() && this.op == KernelVerb.Expire) {
                return true;
            }

            if (observer.onDelete() && this.op == KernelVerb.Delete) {
                return true;
            }

            // No acceptable matches.
            return false;
        });

        for(let observer of observers) {
            // console.info(util.format('ObserverFlow: schema=%j op=%j ring=%j rank=%j observer=%j', 
            //     this.schema.schema_name, 
            //     this.op, 
            //     observer.onRing(),
            //     observer.onRank(),
            //     observer.toFileName()
            // ));

            // Switch to root?
            try {
                // Switch into root?
                if (observer.asRoot()) {
                    this.kernel.sudoRoot();
                }

                // There should be no error when tested
                let sanity = () => {
                    chai.assert(this.failures.length === 0, observer.toFileName() + ': ' + this.failures.join(' / '));
                }

                // Run the full cycle
                await observer.startup(this).then(sanity);
                await observer.run(this).then(sanity);
                await observer.cleanup(this).then(sanity);

                // If we get here we are good.
            }

            finally {
                // Switch out of root?
                if (observer.asRoot()) {
                    this.kernel.sudoExit();
                }
            }
        }
    }
}