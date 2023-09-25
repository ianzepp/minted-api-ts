import _ from 'lodash';

// Classes
import { Observer } from '@classes/neuron';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ObserverRing } from '@typedefs/neuron';
import { DataError } from '@classes/kernel-data';


export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return '*';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
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
        let creates_data = await signal.kernel.knex
            .driverTo(signal.schema.name, 'data')
            .insert(signal.change_data);

        let creates_meta = await signal.kernel.knex
            .driverTo(signal.schema.name, 'meta')
            .insert(signal.change_meta);
    }
}
