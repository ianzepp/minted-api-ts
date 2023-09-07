import _ from 'lodash';

export default function isRecordFlat(source: unknown) {
    return typeof source === 'object'
        && _.has(source, 'id')
        && _.has(source, 'ns')
        && _.has(source, 'created_at')
        && _.has(source, 'updated_at')
        && _.has(source, 'expired_at')
        && _.has(source, 'acls_full')
        && _.has(source, 'acls_edit')
        && _.has(source, 'acls_read')
        && _.has(source, 'acls_deny');
}
