import _ from 'lodash';

export default function isRecordJson(source: unknown) {
    return typeof source === 'object'
        && _.has(source, 'data')
        && _.has(source, 'info')
        && _.has(source, 'acls');
}
