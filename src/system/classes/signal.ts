import _ from 'lodash';
import Debug from 'debug';

// Debugger
const debug = Debug('minted:system:signal-runner');

// Classes
import { Action } from "./action";
import { Record } from "./record";
import { Preloader } from "./preloader";
import { Kernel } from '../kernels/kernel';
import { Object } from './object';
import { Filter } from './filter';
import { sign } from 'jsonwebtoken';

// Build the preloaded actions
const Actions = Preloader.from<Action>('./src/*/actions/**/*.ts');
const ActionsByObject = _.groupBy(Actions, a => a.onObject());

export interface Signal {
    kernel: Kernel;
    object: Object;
    change: Record[];
    filter: Filter;
    op: SignalOp;
}

export enum SignalOp {
    Create = 'create',
    Delete = 'delete',
    Expire = 'expire',
    Select = 'select',
    Update = 'update',
    Upsert = 'upsert',
}

// Implementation
export class SignalRunner {
    async run(signal: Signal): Promise<Record[]> {
        // Filter primary actions in a single loop
        let actions = Actions.filter(action => {
            //
            // Negative checks
            //

            // Action object does not match the signal object?
            if (signal.object.inherits(action.onObject()) === false) {
                return false;
            }

            //
            // Positive checks
            //

            if (signal.op == SignalOp.Select && action.onSelect()) {
                return true;
            }

            if (signal.op == SignalOp.Create && action.onCreate()) {
                return true;
            }

            if (signal.op == SignalOp.Update && action.onUpdate()) {
                return true;
            }

            if (signal.op == SignalOp.Upsert && action.onUpsert()) {
                return true;
            }

            if (signal.op == SignalOp.Expire && action.onExpire()) {
                return true;
            }

            if (signal.op == SignalOp.Delete && action.onDelete()) {
                return true;
            }

            // No acceptable matches.
            return false;
        });

        // Sort by rank
        let actions_rank = _.sortBy(actions, a => a.onRank());

        // Group by ring
        let actions_ring = _.groupBy(actions_rank, a => a.onRing());

        // Iterate rings, then actions in those rings
        for(let ring of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            let list = actions_ring[ring] || [];

            for(let action of list) {
                await this.try(signal, action);
            }
        }

        // Done
        return signal.change;
    }

    async try(signal: Signal, action: Action) {
        if (process.env.DEBUG) {
            debug(`try action: op="${ signal.op }" ring="${ action.onRing() }" rank="${ action.onRank() }" action="${ action.toPackageName() }"`);
        }

        try {
            // Switch into root?
            if (action.asRoot()) {
                signal.kernel.sudoRoot();
            }

            // Setup the result
            let result: Promise<any>;

            // Which method do we use?
            if (action.isRunnable() === false) {
                result = undefined;
            }

            else if (action.isParallel()) {
                result = Promise.all(signal.change.map(record => action.one(signal, record)));
            }

            else if (action.isSeries()) {
                for(let record of signal.change) {
                    await action.one(signal, record);
                }
            }

            else {
                result = action.run(signal);
            }

            // Do we wait to result the result?
            if (result instanceof Promise) {
                result = await result;
            }

            // Finished with execution
        }

        catch (error) {
            if (action.isFailable()) {
                console.error('Action execution failed, but action `isFailable()` is true:');
                console.error(error.stack || error.message || error);
            }

            else {
                throw error;
            }
        }

        finally {
            // Switch out of root?
            if (action.asRoot()) {
                signal.kernel.sudoExit();
            }
        }
    }
}