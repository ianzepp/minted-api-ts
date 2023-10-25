import _ from 'lodash';
import Debug from 'debug';

// Debugger
const debug = Debug('minted:system:signal-runner');

// Classes
import { Action, ActionRingKeys } from "@kernel/classes/action";
import { Record } from "@kernel/classes/record";
import { Kernel } from '@kernel/classes/kernel';
import { Object } from '@kernel/classes/object';
import { Filter } from '@kernel/classes/filter';
import { Loader } from '@kernel/classes/loader';

// Build the preloaded actions
export const Actions = Loader.glob<Action>('./src/*/actions/**/*.ts');
export const ActionsByObject = _.groupBy(Action, action => action.onObject());

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
        let actions = _.chain(Actions)
            .filter(action => signal.object.inherits(action.onObject()))
            .filter(action => action.onMethod() === signal.op)
            .value();

        debug(`signal object "${ signal.object.system_name }" op "${ signal.op }" has ${ actions.length } total actions..`);

        // Group by ring
        let actions_ring = _.groupBy(actions, action => action.onRing());

        // Iterate rings, then actions in those rings
        for(let ring of ['init', 'test', 'knex', 'post', 'done']) {
            let list = _.get(actions_ring, ring, []);

            if (list.length === 0) {
                continue;
            }

            debug(`signal ring "${ ring }" has "${ list.length }" matching actions..`);

            for(let action of list) {
                await this.try(signal, action);
            }
        }

        // Done
        return signal.change;
    }

    async try(signal: Signal, action: Action) {
        if (process.env.DEBUG) {
            debug(`action: action="${ action.toPackageName() }" option=%j`, action.option);
        }

        try {
            // Stat bump
            signal.kernel.statbump(action.toPackageName());

            // Switch into root?
            if (action.option.elevated) {
                debug(`action is elevated: switching to sudoRoot()!`);
                signal.kernel.sudoRoot();
            }

            // Setup the result
            let result: Promise<any>;

            // Which method do we use?
            if (action.option.parallel) {
                result = Promise.all(signal.change.map(record => action.one(signal, record)));
            }

            if (action.option.series) {
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
            if (action.option.failable) {
                console.error('Action execution failed, but action `isFailable()` is true:');
                console.error(error.stack || error.message || error);
            }

            else {
                throw error;
            }
        }

        finally {
            // Switch out of root?
            if (action.option.elevated) {
                debug(`action is elevated: reverting to sudoExit()!`);
                signal.kernel.sudoExit();
            }
        }
    }
}