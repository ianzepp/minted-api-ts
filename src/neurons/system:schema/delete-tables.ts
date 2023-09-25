import _ from 'lodash';

// Classes
import { AutoInstall } from '@classes/autoinstall';
import { Neuron } from '@classes/neuron';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { NeuronRing } from '@typedefs/neuron';
import { SchemaType } from '@typedefs/schema';

export default class extends Neuron {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return SchemaType.Schema;
    }

    onRing(): NeuronRing {
        return NeuronRing.Post;
    }

    onDelete(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        await Promise.all(signal.change.map(record => this.one(signal, record)));
    }

    async one(signal: Signal, record: Record) {
        let schema_name = record.data.name;
        let schema_type = record.data.type;
        let auto = new AutoInstall(signal.kernel);

        // Only delete schemas that are marked as `database` types
        if (schema_type !== 'database') {
            return;
        }

        // Drop the table
        await auto.deleteTable(schema_name);

        // Remove from kernel metadata
        signal.kernel.meta.schemas.delete(schema_name);
    }
}