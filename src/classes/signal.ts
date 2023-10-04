import _ from 'lodash';
import fs from 'fs-extra';
import util from 'util';
import chai from 'chai';
import { expect } from 'chai';

// Classes
import { Filter } from '@classes/filter';
import { Kernel } from '@classes/kernel';
import { Action } from '@root/src/classes/action';
import { Record } from '@classes/record';
import { Object } from '@classes/object';

// Typedefs
import { SignalOp } from '@typedefs/signal';

// Import pre-loaded routers
import Actions from '../loaders/actions';


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
        let actions = Actions[ring] || [];

        // Filter in a single loop
        actions = actions.filter(action => {
            //
            // Negetive checks
            //

            // Wrong client namespace?
            if (action.onDomain() != '*' && action.onDomain() !== this.kernel.user_ns) {
                return false;
            }

            // Wrong object name?
            if (action.onObject() != '*' && action.onObject() !== this.object.name) {
                return false;
            }

            // // Don't run for root?
            // if (action.onRoot() === false && this.kernel.isRoot()) {
            //     return false;
            // }

            // Don't run for test cases?
            if (action.onTest() === false && this.kernel.isNodeTest()) {
                return false;
            }

            //
            // Positive checks
            //

            if (action.onSelect() && this.op == SignalOp.Select) {
                return true;
            }

            if (action.onCreate() && this.op == SignalOp.Create) {
                return true;
            }

            if (action.onUpdate() && this.op == SignalOp.Update) {
                return true;
            }

            if (action.onUpsert() && this.op == SignalOp.Upsert) {
                return true;
            }

            if (action.onExpire() && this.op == SignalOp.Expire) {
                return true;
            }

            if (action.onDelete() && this.op == SignalOp.Delete) {
                return true;
            }

            // No acceptable matches.
            return false;
        });

        for(let action of actions) {
            // console.info(util.format('Signal: object=%j op=%j ring=%j rank=%j action=%j', 
            //     this.object.name, 
            //     this.op, 
            //     action.onRing(),
            //     action.onRank(),
            //     action.toFileName()
            // ));

            // Switch to root?
            try {
                // Switch into root?
                if (action.asRoot()) {
                    this.kernel.sudoRoot();
                }

                // There should be no error when tested
                let sanity = () => {
                    chai.assert(this.failures.length === 0, action.toFileName() + ': ' + this.failures.join(' / '));
                }

                // Run the full cycle
                await action.startup(this).then(sanity);
                await action.run(this).then(sanity);
                await action.cleanup(this).then(sanity);

                // If we get here we are good.
            }

            finally {
                // Switch out of root?
                if (action.asRoot()) {
                    this.kernel.sudoExit();
                }
            }
        }
    }
}