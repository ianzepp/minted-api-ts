import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Thread } from '@classes/thread';

// Typedefs
import { ObserverRing } from '@typedefs/observer';


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

    onDelete(): boolean {
        return true;
    }

    async run(thread: Thread): Promise<void> {
        return thread.kernel.knex
            .driverTo(thread.schema.name, 'meta')
            .whereIn('id', _.map(thread.change_data, 'id'))
            .update({
                deleted_at: thread.kernel.time,
                deleted_by: thread.kernel.user_id
            });
    }

    async cleanup(thread: Thread) {
        thread.change.forEach(record => {
            record.meta.deleted_at = thread.kernel.time;
            record.meta.deleted_by = thread.kernel.user_id;
        })
    }
}