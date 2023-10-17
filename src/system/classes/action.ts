import path from 'path';

// Classes
import { Signal } from '@system/classes/signal';
import { Record } from '@system/classes/record';

// Typedefs
import { ActionRank } from '@system/typedefs/action';
import { ActionRing } from '@system/typedefs/action';

export class Action {
    // Re-export aliases
    public static Rank = ActionRank;
    public static Ring = ActionRing;

    constructor() {}

    async startup(signal: Signal): Promise<any> {}
    async run(signal: Signal): Promise<any> {}
    async one(signal: Signal, record: Record, index?: number): Promise<any> {}
    async cleanup(signal: Signal): Promise<any> {}

    toJSON(): Object {
        return {
            'name': this.toName(),
            'on_object': this.onObject(),
            'on_ring': this.onRing(),
            'on_rank': this.onRank(),
            'on_root': this.onRoot(),
            'on_select': this.onSelect(),
            'on_create': this.onCreate(),
            'on_update': this.onUpdate(),
            'on_upsert': this.onUpsert(),
            'on_expire': this.onExpire(),
            'on_delete': this.onDelete(),
            'is_series': this.isSeries(),
            'is_parallel': this.isParallel(),
            'is_failable': this.isFailable(),
            'is_detached': this.isDetached(),
        };
    }

    /**
     * Method to get the name of the action file
     * @returns {string} - The name of the action file
     */
    toName(): string {
        return '<undefined>';
    }

    toPackageName(): string {
        return this.toName().replace(path.resolve('./src') + '/', '@');
    }

    /**
     * Method to get the `Domain` namespace that this action targets, or `*` if it applies to all clients
     * @returns {string} - The targeted `Client` namespace
     */
    onDomain(): string {
        return '*';
    }

    /**
     * Method to get the `Object` that this action targets, or `*` if it applies to all objects
     * @returns {string} - The targeted `Object` name
     */
    onObject(): string {
        return '*';
    }

    /**
     * Method to get the action ring
     * @returns {ActionRing} - The action ring
     */
    onRing(): ActionRing {
        return ActionRing.Transform;
    }

    /**
     * Method to get the action rank
     * @returns {ActionRank} - The action rank: 0 (low) to 9 (high). Defaults to 5 (average)
     */
    onRank(): ActionRank {
        return ActionRank.Avg;
    }

    /**
     * Method to get if the action should run when `root` is executing
     * @returns {boolean} - True by default
     */
    onRoot(): boolean {
        return true;
    }

    /**  
     * Specifies if the action should switch to root context before executing. 
     * @returns {boolean} - False by default
     */
    asRoot(): boolean {
        return false;
    }

    /**
     * Base method to check if the action is selectable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the action should run for `KernelVerb.Select` operations, false otherwise
     */
    onSelect(): boolean {
        return false;
    }

    /**
     * Base method to check if the action is creatable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the action should run for `KernelVerb.Create` operations, false otherwise
     */
    onCreate(): boolean {
        return false;
    }

    /**
     * Base method to check if the action is updatable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the action should run for `KernelVerb.Update` operations, false otherwise
     */
    onUpdate(): boolean {
        return false;
    }

    /**
     * Base method to check if the action is upsertable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the action should run for `KernelVerb.Upsert` operations, false otherwise
     */
    onUpsert(): boolean {
        return false;
    }

    /**
     * Base method to check if the action is expirable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the action should run for `KernelVerb.Expire` operations, false otherwise
     */
    onExpire(): boolean {
        return false;
    }

    /**
     * Base method to check if the action is deletable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the action should run for `KernelVerb.Delete` operations, false otherwise
     */
    onDelete(): boolean {
        return false;
    }

    /**
     * Base method to check if the action is runnable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the action is runnable, false otherwise
     */
    isRunnable(): boolean {
        return true;
    }

    /**
     * Base method to check if the action is failable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the action can fail with errors (that will be ignored)
     */
    isFailable(): boolean {
        return false;
    }

    /**
     * If the records should be processed one by one, each time passed to the `one(signal, record)` method.
     * @returns {boolean}
     */
    isSeries(): boolean {
        return false;
    }

    /**
     * If the records can be processed all at once in parallel, then set this method to `true`
     * @returns {boolean}
     */
    isParallel(): boolean {
        return false;
    }

    /**
     * Returns `true` when we don't need to block the rest of the promises, even if this fails.
     * @returns {boolean}
     */
    isDetached(): boolean {
        return false;
    }

}
