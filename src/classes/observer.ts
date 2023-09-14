import path from 'path';

// Classes
import { Thread } from '@classes/thread';

// Typedefs
import { ObserverRank } from '@typedefs/observer';
import { ObserverRing } from '@typedefs/observer';

export class Observer {
    // Re-export aliases
    public static Rank = ObserverRank;
    public static Ring = ObserverRing;

    constructor() {}

    async startup(thread: Thread): Promise<any> {}
    async run(thread: Thread): Promise<any> {}
    async cleanup(thread: Thread): Promise<any> {}

    toJSON(): Object {
        return {
            'name': this.toName(),
            'on_schema': this.onSchema(),
            'on_ring': this.onRing(),
            'on_rank': this.onRank(),
            'on_root': this.onRoot(),
            'on_test': this.onTest(),
            'on_select': this.onSelect(),
            'on_create': this.onCreate(),
            'on_update': this.onUpdate(),
            'on_upsert': this.onUpsert(),
            'on_expire': this.onExpire(),
            'on_delete': this.onDelete(),
        };
    }

    /**
     * Method to get the name of the observer file
     * @returns {string} - The name of the observer file
     */
    toName(): string {
        return '<undefined>';
    }

    toFileName(): string {
        return path.basename(this.toName());
    }

    /**
     * Method to get the `Domain` namespace that this observer targets, or `*` if it applies to all clients
     * @returns {string} - The targeted `Client` namespace
     */
    onDomain(): string {
        return '*';
    }

    /**
     * Method to get the `Schema` that this observer targets, or `*` if it applies to all schemas
     * @returns {string} - The targeted `Schema` name
     */
    onSchema(): string {
        return '*';
    }

    /**
     * Method to get the observer ring
     * @returns {ObserverRing} - The observer ring
     */
    onRing(): ObserverRing {
        return ObserverRing.Work;
    }

    /**
     * Method to get the observer rank
     * @returns {ObserverRank} - The observer rank: 0 (low) to 9 (high). Defaults to 5 (average)
     */
    onRank(): ObserverRank {
        return ObserverRank.Avg;
    }

    /**
     * Method to get if the observer should run when `root` is executing
     * @returns {boolean} - True by default
     */
    onRoot(): boolean {
        return true;
    }

    /**
     * Method to get if the observer should run when `test` is executing
     * @returns {boolean} - True by default
     */
    onTest(): boolean {
        return true;
    }

    /**  
     * Specifies if the observer should switch to root context before executing. 
     * @returns {boolean} - False by default
     */
    asRoot(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is selectable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `KernelVerb.Select` operations, false otherwise
     */
    onSelect(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is creatable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `KernelVerb.Create` operations, false otherwise
     */
    onCreate(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is updatable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `KernelVerb.Update` operations, false otherwise
     */
    onUpdate(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is upsertable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `KernelVerb.Upsert` operations, false otherwise
     */
    onUpsert(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is expirable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `KernelVerb.Expire` operations, false otherwise
     */
    onExpire(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is deletable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `KernelVerb.Delete` operations, false otherwise
     */
    onDelete(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is runnable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer is runnable, false otherwise
     */
    isRunnable(): boolean {
        return true;
    }

    /**
     * Base method to check if the observer is failable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer can fail with errors (that will be ignored)
     */
    isFailable(): boolean {
        return false;
    }
}
