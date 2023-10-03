import _ from 'lodash';

// Classes
import { Neuron } from '@classes/neuron';
import { Signal } from '@classes/signal';

// Typedefs
import { NeuronRing } from '@typedefs/neuron';


export default class extends Neuron {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return '*';
    }

    onRing(): NeuronRing {
        return NeuronRing.Knex;
    }

    onDelete(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        return signal.kernel.data
            .driverTo(signal.object.name, 'meta')
            .whereIn('id', _.map(signal.change_data, 'id'))
            .update({
                deleted_at: signal.kernel.time,
                deleted_by: signal.kernel.user_id
            });
    }

    async cleanup(signal: Signal) {
        signal.change.forEach(record => {
            record.meta.deleted_at = signal.kernel.time;
            record.meta.deleted_by = signal.kernel.user_id;
        })
    }
}