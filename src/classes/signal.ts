import _ from 'lodash';
import fs from 'fs-extra';
import util from 'util';
import chai from 'chai';
import { expect } from 'chai';

// Classes
import { Filter } from '@classes/filter';
import { Kernel } from '@kernels/kernel';
import { Action } from '@classes/action';
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

    isSelect() {
        return this.op === SignalOp.Select;
    }

    isCreate() {
        return this.op === SignalOp.Create;
    }

    isUpdate() {
        return this.op === SignalOp.Update;
    }

    isUpsert() {
        return this.op === SignalOp.Upsert;
    }

    isExpire() {
        return this.op === SignalOp.Expire;
    }

    isDelete() {
        return this.op === SignalOp.Delete;
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
            if (action.onObject() != '*' && action.onObject() !== this.object.object_name) {
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

                // Startup the action
                await action.startup(this).then(sanity);

                // Setup the result
                let result: Promise<any>;

                // Which method do we use?
                if (action.isParallel()) {
                    result = Promise.all(this.change.map((r, i) => action.one(this, r, i))).then(sanity);
                }

                else {
                    result = action.run(this).then(sanity);
                }

                // If we are not detached, then wait for the result. Not that we care about the result, 
                // just that it needs to finish executing.
                if (action.isDetached() === false) {
                    await result;
                }

                // Cleanup the action
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