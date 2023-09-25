import path from 'path';

// Classes
import { Signal } from '@classes/signal';

// Typedefs
import { NeuronRank } from '@typedefs/neuron';
import { NeuronRing } from '@typedefs/neuron';

export class Neuron {
    // Re-export aliases
    public static Rank = NeuronRank;
    public static Ring = NeuronRing;

    constructor() {}

    async startup(signal: Signal): Promise<any> {}
    async run(signal: Signal): Promise<any> {}
    async cleanup(signal: Signal): Promise<any> {}

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
     * Method to get the name of the neuron file
     * @returns {string} - The name of the neuron file
     */
    toName(): string {
        return '<undefined>';
    }

    toFileName(): string {
        return path.basename(this.toName());
    }

    /**
     * Method to get the `Domain` namespace that this neuron targets, or `*` if it applies to all clients
     * @returns {string} - The targeted `Client` namespace
     */
    onDomain(): string {
        return '*';
    }

    /**
     * Method to get the `Schema` that this neuron targets, or `*` if it applies to all schemas
     * @returns {string} - The targeted `Schema` name
     */
    onSchema(): string {
        return '*';
    }

    /**
     * Method to get the neuron ring
     * @returns {NeuronRing} - The neuron ring
     */
    onRing(): NeuronRing {
        return NeuronRing.Work;
    }

    /**
     * Method to get the neuron rank
     * @returns {NeuronRank} - The neuron rank: 0 (low) to 9 (high). Defaults to 5 (average)
     */
    onRank(): NeuronRank {
        return NeuronRank.Avg;
    }

    /**
     * Method to get if the neuron should run when `root` is executing
     * @returns {boolean} - True by default
     */
    onRoot(): boolean {
        return true;
    }

    /**
     * Method to get if the neuron should run when `test` is executing
     * @returns {boolean} - True by default
     */
    onTest(): boolean {
        return true;
    }

    /**  
     * Specifies if the neuron should switch to root context before executing. 
     * @returns {boolean} - False by default
     */
    asRoot(): boolean {
        return false;
    }

    /**
     * Base method to check if the neuron is selectable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the neuron should run for `KernelVerb.Select` operations, false otherwise
     */
    onSelect(): boolean {
        return false;
    }

    /**
     * Base method to check if the neuron is creatable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the neuron should run for `KernelVerb.Create` operations, false otherwise
     */
    onCreate(): boolean {
        return false;
    }

    /**
     * Base method to check if the neuron is updatable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the neuron should run for `KernelVerb.Update` operations, false otherwise
     */
    onUpdate(): boolean {
        return false;
    }

    /**
     * Base method to check if the neuron is upsertable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the neuron should run for `KernelVerb.Upsert` operations, false otherwise
     */
    onUpsert(): boolean {
        return false;
    }

    /**
     * Base method to check if the neuron is expirable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the neuron should run for `KernelVerb.Expire` operations, false otherwise
     */
    onExpire(): boolean {
        return false;
    }

    /**
     * Base method to check if the neuron is deletable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the neuron should run for `KernelVerb.Delete` operations, false otherwise
     */
    onDelete(): boolean {
        return false;
    }

    /**
     * Base method to check if the neuron is runnable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the neuron is runnable, false otherwise
     */
    isRunnable(): boolean {
        return true;
    }

    /**
     * Base method to check if the neuron is failable. The actual value will be defined in child classes.
     * For example, see @knex-select.ts or @test-immutable.ts.
     * @returns {boolean} - True if the neuron can fail with errors (that will be ignored)
     */
    isFailable(): boolean {
        return false;
    }
}
