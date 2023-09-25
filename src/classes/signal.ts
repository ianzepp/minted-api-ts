import _ from 'lodash';
import fs from 'fs-extra';
import util from 'util';
import chai from 'chai';
import { expect } from 'chai';

// Classes
import { Corpus } from '@classes/corpus';
import { Filter } from '@classes/filter';
import { Kernel } from '@classes/kernel';
import { Neuron } from '@classes/neuron';
import { Record } from '@classes/record';
import { Schema } from '@classes/schema';

// Typedefs
import { SignalOp } from '@typedefs/signal';

// Import pre-loaded routers
import Neurons from '@preloader/neurons';

export class Signal {
    readonly expect = chai.expect;
    readonly failures: string[] = [];

    constructor(
        readonly kernel: Kernel,
        readonly corpus: Corpus,
        readonly filter: Filter,
        readonly op: SignalOp) {}

    get schema() {
        return this.corpus.schema;
    }

    get change() {
        return this.corpus.records;
    }

    get change_data() {
        return _.map(this.change, record => _.assign({}, record.data));

    }

    get change_meta() {
        return _.map(this.change, record => _.assign({}, record.meta, { id: record.data.id, ns: record.data.ns }));
    }

    async run(ring: number): Promise<void> {
        let observers = Neurons[ring] || [];

        // Filter in a single loop
        observers = observers.filter(observer => {
            //
            // Negetive checks
            //

            // Wrong client namespace?
            if (observer.onDomain() != '*' && observer.onDomain() !== this.kernel.user_ns) {
                return false;
            }

            // Wrong schema name?
            if (observer.onSchema() != '*' && observer.onSchema() !== this.schema.name) {
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

            if (observer.onSelect() && this.op == SignalOp.Select) {
                return true;
            }

            if (observer.onCreate() && this.op == SignalOp.Create) {
                return true;
            }

            if (observer.onUpdate() && this.op == SignalOp.Update) {
                return true;
            }

            if (observer.onUpsert() && this.op == SignalOp.Upsert) {
                return true;
            }

            if (observer.onExpire() && this.op == SignalOp.Expire) {
                return true;
            }

            if (observer.onDelete() && this.op == SignalOp.Delete) {
                return true;
            }

            // No acceptable matches.
            return false;
        });

        for(let observer of observers) {
            // console.info(util.format('Signal: schema=%j op=%j ring=%j rank=%j observer=%j', 
            //     this.schema.name, 
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