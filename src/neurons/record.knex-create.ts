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

    onCreate(): boolean {
        return true;
    }

    async startup(signal: Signal): Promise<void> {
        let created_at = new Date().toISOString();
        let created_by = signal.kernel.uuid();

        // Set ID and namespace. It is possible they are already set, if we are running as root and
        // the root user supplied the IDs. 
        //
        // See the testing / precheck login in `test-create.ts`.
        signal.change.forEach(record => {
            if (signal.kernel.isRoot()) {
                record.data.id = record.data.id ?? signal.kernel.uuid();
                record.data.ns = record.data.ns ?? signal.kernel.user_ns;
                record.meta.created_at = record.meta.created_at ?? created_at;
                record.meta.created_by = record.meta.created_at ?? created_by;
            }

            else {
                record.data.id = signal.kernel.uuid();
                record.data.ns = signal.kernel.user_ns;
                record.meta.created_at = created_at;
                record.meta.created_by = created_by;
            }
        });
    }

    async run(signal: Signal): Promise<void> {
        let creates_data = await signal.kernel.data
            .driverTo(signal.object.name, 'data')
            .insert(signal.change_data);

        let creates_meta = await signal.kernel.data
            .driverTo(signal.object.name, 'meta')
            .insert(signal.change_meta);
    }
}
