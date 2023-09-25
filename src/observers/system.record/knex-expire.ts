import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Signal } from '@classes/signal';

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

    onExpire(): boolean {
        return true;
    }

    async run(thread: Signal): Promise<void> {
        return thread.kernel.knex
            .driverTo(thread.schema.name, 'meta')
            .whereIn('id', _.map(thread.change_data, 'id'))
            .update({
                expired_at: thread.kernel.time,
                expired_by: thread.kernel.user_id
            });
    }

    async cleanup(thread: Signal) {
        thread.change.forEach(record => {
            record.meta.expired_at = thread.kernel.time;
            record.meta.expired_by = thread.kernel.user_id;
        })
    }
}