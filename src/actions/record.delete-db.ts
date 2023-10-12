import _ from 'lodash';

// Classes
import { Action } from '@classes/action';
import { Signal } from '@classes/signal';

// Typedefs
import { ActionRing } from '@typedefs/action';


export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return '*';
    }

    onRing(): ActionRing {
        return ActionRing.Database;
    }

    onDelete(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        return signal.kernel.knex
            .driverTo(signal.object.object_name, 'meta')
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