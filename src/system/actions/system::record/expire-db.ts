import _ from 'lodash';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';

// Typedefs
import { ActionRing } from '@system/typedefs/action';


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

    onExpire(): boolean {
        return true;
    }

    async run({ kernel, object, change }: Signal) {
        let record_ids = change.map(record => record.data.id);
        let expired_at = kernel.time;
        let expired_by = kernel.user_id;

        // Run the change
        await kernel.knex.driverTo(object.system_name, 'meta', record_ids).update({
            expired_at: kernel.time,
            expired_by: kernel.user_id
        });
        
        // Change the record data to reflect it
        change.forEach(record => {
            record.meta.expired_at = expired_at;
            record.meta.expired_by = expired_by;
        });
    }
}