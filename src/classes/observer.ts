
// Classes
import { ObserverFlow } from '@classes/observer-flow';

// Layouts
import { ObserverRank } from '@layouts/observer';
import { ObserverRing } from '@layouts/observer';

export class Observer {
    // Re-export aliases
    public static Rank = ObserverRank;
    public static Ring = ObserverRing;

    constructor() {}

    async startup(flow: ObserverFlow): Promise<any> {}
    async run(flow: ObserverFlow): Promise<any> {}
    async cleanup(flow: ObserverFlow): Promise<any> {}

    toJSON(): Object {
        return {
            'name': this.toName(),
            'on_schema': this.onSchema(),
            'on_ring': this.onRing(),
            'on_rank': this.onRank(),
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
        return __filename;
    }

    /**
     * Method to get the schema
     * @returns {string} - The schema
     */
    onSchema(): string {
        throw 500;
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
     * Base method to check if the observer is selectable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `SystemVerb.Select` operations, false otherwise
     */
    onSelect(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is creatable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `SystemVerb.Create` operations, false otherwise
     */
    onCreate(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is updatable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `SystemVerb.Update` operations, false otherwise
     */
    onUpdate(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is upsertable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `SystemVerb.Upsert` operations, false otherwise
     */
    onUpsert(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is expirable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `SystemVerb.Expire` operations, false otherwise
     */
    onExpire(): boolean {
        return false;
    }

    /**
     * Base method to check if the observer is deletable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the observer should run for `SystemVerb.Delete` operations, false otherwise
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
