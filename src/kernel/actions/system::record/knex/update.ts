import _ from 'lodash';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';

export default class extends Action {
    constructor() {
        super(__filename);
    }
    
    async run({ kernel, object, change }: Signal) {
        // Setup `meta` change
        let record_ids = change.map(record => record.data.id);
        let updated_at = kernel.time;
        let updated_by = kernel.user_id;

        // Update `data` one a row-by-row basis.
        await Promise.all(change.map(record => {
            return kernel.knex.driverTo(object.system_name, 'data', [record.data.id]).update(record.diff);
        }));

        // Update `meta` all at once
        await kernel.knex.driverTo(object.system_name, 'meta', record_ids).update({ updated_at, updated_by });

        // Change the record data to reflect it
        change.forEach(record => _.assign(record.meta, { updated_at, updated_by }));
    }
}