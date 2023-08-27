import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Record } from '../classes/record';

// Predefined column names for the metainfo table
const COLUMNS_INFO = [
    'created_at',
    'created_by',
    'updated_at',
    'updated_by',
    'expired_at',
    'expired_by',
    'trashed_at',
    'trashed_by',
    'deleted_at',
    'deleted_by',
];

const COLUMNS_ACLS = [
    'acls_full',
    'acls_edit',
    'acls_read',
    'acls_deny',

];

export default class extends Observer {
    toName() {
        return 'record.knex-select';
    }
    
    onSchema() {
        return 'record';
    }

    onRing() {
        return Observer.RING_KNEX;
    }

    onSelect() {
        return true;
    }

    async run(flow: ObserverFlow) {
        // Query the database
        let acls = [] as string[];
        let knex = flow.system.knex.using(flow.schema.name, true).select();

        // Ignore rows that are outside our namespace (if applicable)
        if (flow.system.user.ns.includes('*') === false) {
            knex = knex.whereNull('data.ns').orWhereIn('data.ns', flow.system.user.ns);
        }
        
        // Ignore rows that are outside our security classification (if applicable)
        if (flow.system.user.sc.includes('*') === false) {
            knex = knex.whereNull('data.sc').orWhereIn('data.sc', flow.system.user.sc);
        }
        
        knex = knex.whereNull('data.ns').orWhereIn('data.ns', flow.system.user.ns);
        knex = knex.whereNull('data.sc').orWhereIn('data.sc', flow.system.user.sc);

        // Ignore expired files
        knex = knex.whereNull('info.expired_at');
        
        // Ignore deleted files
        knex = knex.whereNull('info.deleted_at');

        // Wait for the result
        let result = await knex;

        // Convert the raw results into records
        let select = _.map(result, data => new Record(flow.schema, { 
            data: _.omit(data, COLUMNS_INFO, COLUMNS_ACLS, ['id_table']),
            info: _.pick(data, COLUMNS_INFO),
            acls: _.pick(data, COLUMNS_ACLS)
        }));

        // Reset change list and add to results
        flow.change.length = 0;
        flow.change.push(... select);
    }
}