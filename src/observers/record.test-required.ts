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
        return Observer.RING_TEST;
    }

    onCreate() {
        return true;
    }

    async run(flow: ObserverFlow) {
        
    }
}