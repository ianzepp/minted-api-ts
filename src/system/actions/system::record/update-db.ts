import _ from 'lodash';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';
import { Record } from '@system/classes/record';

// Typedefs
import { ActionRing } from '@system/typedefs/action';
import { DataError } from '@system/kernels/kernel-data';


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

    onUpdate(): boolean {
        return true;
    }

    async run({ kernel, object, change }: Signal) {
        // Update `data` one a row-by-row basis.
        await Promise.all(change.map(record => {
            return kernel.knex
                .driverTo(object.system_name, 'data')
                .whereIn('data.id', [record.data.id])
                .update(record.diff);
        }));

        // Setup `meta` change
        let record_ids = change.map(record => record.data.id);
        let updated_at = kernel.time;
        let updated_by = kernel.user_id;

        // Update `meta` all at once
        await kernel.knex.driverTo(object.system_name, 'meta', record_ids).update({
            updated_at: updated_at,
            updated_by: updated_by
        });

        // Change the record data to reflect it
        change.forEach(record => {
            record.meta.updated_at = updated_at;
            record.meta.updated_by = updated_by;
        });
    }
}