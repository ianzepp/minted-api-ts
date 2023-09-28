import _ from 'lodash';

// Classes
import { Neuron } from '@classes/neuron';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { NeuronRing } from '@typedefs/neuron';
import { DataError } from '@classes/kernel-data';


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

    onUpdate(): boolean {
        return true;
    }

    async startup(signal: Signal) {
        let exceptions = signal.change.filter(record => typeof record.data.id !== 'string');

        if (exceptions.length) {
            throw new DataError('One or more records are missing IDs');
        }
    }


    async run(signal: Signal) {
        return Promise.all(signal.change.map(record => this.one(signal, record)));
    }

    async one(signal: Signal, record: Record) {
        return signal.kernel.knex
            .driverTo(signal.object.name, 'data')
            .whereIn('data.id', [record.data.id])
            .update(record.diff);
    }

    async cleanup(signal: Signal) {
        signal.change.forEach(record => {
            record.meta.updated_at = signal.kernel.time;
            record.meta.updated_by = signal.kernel.user_id;
        });
    }
}