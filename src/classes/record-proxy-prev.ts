// import _ from 'lodash';
// import assert from 'assert';

// import { Record } from '../classes/record';
// import { RecordData } from '../classes/record';

// export class RecordProxyPrev implements RecordData {
//     constructor(record: Record) {
//         return new Proxy(record, {
//             get: get,
//         });
//     }
// }

// function get(record: Record, p: string | number | symbol) {
//     if (p === 'toJSON' || p === Symbol.toStringTag) {
//         return () => toJSON(record);
//     }

//     assert(typeof p === 'string', String(p));
//     // assert(p in source, p);

//     return record.__source_prev[p];
// }

// function toJSON(record: Record) {
//     return _.transform(record.__source_prev, (result, v, p) => {
//         return _.set(result, p, v);
//     }, {});
// }