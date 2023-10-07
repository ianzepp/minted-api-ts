import _ from 'lodash';

// Classes
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';

// Typedefs
import { ActionRing } from '@root/src/typedefs/action';


export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return '*';
    }

    onRing(): ActionRing {
        return ActionRing.Knex;
    }

    onExpire(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        return signal.kernel.data
            .driverTo(signal.object.name, 'meta')
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