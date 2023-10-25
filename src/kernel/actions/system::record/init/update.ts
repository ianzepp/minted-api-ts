import _ from 'lodash';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';

export default class extends Action {
    constructor() {
        super(__filename);
    }
    
    async run({ kernel, object, change }: Signal) {
        // Easiest to use the existing data service to reselect record data
        let result = await kernel.data.selectAll(object, change);
        let result_map = _.keyBy(result, 'data.id');

        // Assign the raw knex data for previous values to the records
        for(let record of change) {
            let record_prev = result_map[record.data.id];

            if (record_prev === undefined) {
                continue; // TODO Is this an error? We have an ID but no record found?
            }

            _.assign(record.prev, record_prev.data);
            _.assign(record.meta, record_prev.meta);
            _.assign(record.acls, record_prev.acls);
        }
    }
}