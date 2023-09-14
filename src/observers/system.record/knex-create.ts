import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Thread } from '@classes/thread';
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

    async startup(thread: Thread): Promise<void> {
        // Set ID and namespace. It is possible they are already set, if we are running as root and
        // the root user supplied the IDs. 
        //
        // See the testing / precheck login in `test-create.ts`.
        thread.change.forEach(record => {
            record.data.id = record.data.id || thread.kernel.uuid();
            record.data.ns = record.data.ns || thread.kernel.user_ns;
        });
    }

    async run(thread: Thread): Promise<void> {
        let creates = await thread.kernel.knex
            .driverTo(thread.schema.schema_name, 'data')
            .insert(thread.change_data)
            .returning('*');

        for(let i in thread.change) {
            let create = creates[i];
            let change = thread.change[i];

            _.assign(change.data, create);
        }
    }

    async cleanup(thread: Thread): Promise<void> {
        thread.change.forEach(record => {
            record.meta.created_at = thread.kernel.time;
            record.meta.created_by = thread.kernel.user_id;
        });
    }

}
