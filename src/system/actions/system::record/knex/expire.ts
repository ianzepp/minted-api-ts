import _ from 'lodash';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';

export default class extends Action {
    constructor() {
        super(__filename);
    }

    async run({ kernel, object, change }: Signal) {
        let record_ids = change.map(record => record.data.id);
        let expired_at = kernel.time;
        let expired_by = kernel.user_id;

        // Run the change
        await kernel.knex.driverTo(object.system_name, 'meta', record_ids).update({ expired_at, expired_by });
        
        // Change the record data to reflect it
        change.forEach(record => _.assign(record.meta, { expired_at, expired_by }));
    }
}