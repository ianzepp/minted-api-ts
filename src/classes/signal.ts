import _ from 'lodash';
import fs from 'fs-extra';
import util from 'util';
import chai from 'chai';
import { expect } from 'chai';

// Classes
import { Filter } from '@classes/filter';
import { Kernel } from '@classes/kernel';
import { Neuron } from '@classes/neuron';
import { Record } from '@classes/record';
import { Object } from '@classes/object';

// Typedefs
import { SignalOp } from '@typedefs/signal';

// Import pre-loaded routers
import Neurons from '../loaders/neurons';


export class Signal {
    readonly expect = chai.expect;
    readonly failures: string[] = [];

    constructor(
        readonly kernel: Kernel,
        readonly object: Object,
        readonly change: Record[],
        readonly filter: Filter,
        readonly op: SignalOp) {}

    get change_data() {
        return _.map(this.change, record => _.assign({}, record.data));

    }

    get change_meta() {
        return _.map(this.change, record => _.assign({}, record.meta, { id: record.data.id, ns: record.data.ns }));
    }

    async run(ring: number): Promise<void> {
        let neurons = Neurons[ring] || [];

        // Filter in a single loop
        neurons = neurons.filter(neuron => {
            //
            // Negetive checks
            //

            // Wrong client namespace?
            if (neuron.onDomain() != '*' && neuron.onDomain() !== this.kernel.user_ns) {
                return false;
            }

            // Wrong object name?
            if (neuron.onObject() != '*' && neuron.onObject() !== this.object.name) {
                return false;
            }

            // Don't run for root?
            if (neuron.onRoot() === false && this.kernel.isRoot()) {
                return false;
            }

            // Don't run for test cases?
            if (neuron.onTest() === false && this.kernel.isTest()) {
                return false;
            }

            //
            // Positive checks
            //

            if (neuron.onSelect() && this.op == SignalOp.Select) {
                return true;
            }

            if (neuron.onCreate() && this.op == SignalOp.Create) {
                return true;
            }

            if (neuron.onUpdate() && this.op == SignalOp.Update) {
                return true;
            }

            if (neuron.onUpsert() && this.op == SignalOp.Upsert) {
                return true;
            }

            if (neuron.onExpire() && this.op == SignalOp.Expire) {
                return true;
            }

            if (neuron.onDelete() && this.op == SignalOp.Delete) {
                return true;
            }

            // No acceptable matches.
            return false;
        });

        for(let neuron of neurons) {
            // console.info(util.format('Signal: object=%j op=%j ring=%j rank=%j neuron=%j', 
            //     this.object.name, 
            //     this.op, 
            //     neuron.onRing(),
            //     neuron.onRank(),
            //     neuron.toFileName()
            // ));

            // Switch to root?
            try {
                // Switch into root?
                if (neuron.asRoot()) {
                    this.kernel.sudoRoot();
                }

                // There should be no error when tested
                let sanity = () => {
                    chai.assert(this.failures.length === 0, neuron.toFileName() + ': ' + this.failures.join(' / '));
                }

                // Run the full cycle
                await neuron.startup(this).then(sanity);
                await neuron.run(this).then(sanity);
                await neuron.cleanup(this).then(sanity);

                // If we get here we are good.
            }

            finally {
                // Switch out of root?
                if (neuron.asRoot()) {
                    this.kernel.sudoExit();
                }
            }
        }
    }
}