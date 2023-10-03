import _ from 'lodash';

// Classes
import { Neuron } from '@classes/neuron';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { NeuronRing } from '@typedefs/neuron';
import { ObjectType } from '@typedefs/object';
import { Column } from '@classes/column';


export default class extends Neuron {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return ObjectType.Column;
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
        // Create temporary refs
        let column = Column.from(record.data);
        let object = signal.kernel.meta.objects.get(column.object_name);

        await signal.kernel.data.schema.table(`${object.name}/data`, t => {            
            return t.dropColumn(column.column_name);
        });

        // Delete the column data from the parent object
        object.remove(column);

        // Delete the column data from the kernel metadata
        signal.kernel.meta.columns.delete(column.name);
    }
}
