// import _ from 'lodash';
// import assert from 'assert';

// import { Record } from '../classes/record';
// import { RecordData } from '../classes/record';

// const excludes_meta = [
//     'created_at',
//     'created_by',
//     'updated_at',
//     'updated_by',
//     'expired_at',
//     'expired_by',
//     'trashed_at',
//     'trashed_by',
//     'deleted_at',
//     'deleted_by',
// ];

// const excludes_acls = [
//     'acls_full',
//     'acls_edit',
//     'acls_read',
//     'acls_deny',
// ];

// export class RecordProxyData implements RecordData {
//     [index: string]: any;

//     constructor(record: Record) {
//         return new Proxy(record, {
//             get: get,
//             set: set,
//             has: has,
//         });
//     }
// }

// function get(record: Record, p: string | number | symbol) {
//     if (p === 'toJSON' || p === Symbol.toStringTag) {
//         return () => toJSON(record);
//     }

//     assert(typeof p === 'string', String(p));

//     let data = record.__source_data[p];
//     let prev = record.__source_prev[p];

//     if (data !== undefined) {
//         return data;
//     }

//     if (prev !== undefined) {
//         return prev;
//     }

//     return null;
// }

// function set(record: Record, p: string | number | symbol, v: any) {
//     assert(typeof p === 'string', String(p));

//     record.__source_data[p] = v;
//     return true;
// }

// function has(record: Record, p: string | number | symbol) {
//     assert(typeof p === 'string', String(p));
//     return record.__source_data[p] !== undefined || record.__source_prev[p] !== undefined;
// }

// function toJSON(record: Record) {
//     let source = _.assign({}, record.__source_prev, record.__source_data);

//     return _.transform(source, (result, v, p) => {
//         if (excludes_acls.includes(p)) {
//             return result;
//         }

//         if (excludes_meta.includes(p)) {
//             return result;
//         }

//         return _.set(result, p, v);
//     }, {});
// }