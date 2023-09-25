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

    async run(signal: Signal): Promise<void> {
        return signal.kernel.knex
            .driverTo(signal.schema.name, 'meta')
            .whereIn('id', _.map(signal.change_data, 'id'))
            .update({
                expired_at: signal.kernel.time,
                expired_by: signal.kernel.user_id
            });
    }

    async cleanup(signal: Signal) {
        signal.change.forEach(record => {
            record.meta.expired_at = signal.kernel.time;
            record.meta.expired_by = signal.kernel.user_id;
        })
    }
}