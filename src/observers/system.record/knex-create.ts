import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ObserverRing } from '@typedefs/observer';
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

    async startup(thread: Signal): Promise<void> {
        let created_at = new Date().toISOString();
        let created_by = thread.kernel.uuid();

        // Set ID and namespace. It is possible they are already set, if we are running as root and
        // the root user supplied the IDs. 
        //
        // See the testing / precheck login in `test-create.ts`.
        thread.change.forEach(record => {
            if (thread.kernel.isRoot()) {
                record.data.id = record.data.id ?? thread.kernel.uuid();
                record.data.ns = record.data.ns ?? thread.kernel.user_ns;
                record.meta.created_at = record.meta.created_at ?? created_at;
                record.meta.created_by = record.meta.created_at ?? created_by;
            }

            else {
                record.data.id = thread.kernel.uuid();
                record.data.ns = thread.kernel.user_ns;
                record.meta.created_at = created_at;
                record.meta.created_by = created_by;
            }
        });
    }

    async run(thread: Signal): Promise<void> {
        let creates_data = await thread.kernel.knex
            .driverTo(thread.schema.name, 'data')
            .insert(thread.change_data);

        let creates_meta = await thread.kernel.knex
            .driverTo(thread.schema.name, 'meta')
            .insert(thread.change_meta);
    }
}
