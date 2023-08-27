// import _ from 'lodash';
// import assert from 'assert';

// import { Record } from '../classes/record';
// import { RecordAcls } from '../classes/record';

// export class RecordProxyAcls implements RecordAcls {
//     full: string[];
//     edit: string[];
//     read: string[];
//     deny: string[];

//     constructor(record: Record) {
//         // @ts-ignore Required in this case for proxies (which are exotic objects)
//         return new Proxy(record, {
//             get: get,
//             set: set,
//         });
//     }
// }

// function get(record: Record, p: string | number | symbol) {
//     if (p === 'toJSON' || p === Symbol.toStringTag) {
//         return () => toJSON(record);
//     }

//     assert(typeof p === 'string', String(p));
//     return record.__source_data[p];
// }

// function set(record: Record, p: string | number | symbol, v: any) {
//     assert(typeof p === 'string', String(p));
//     record.__source_data[p] = v;
//     return true;
// }

// function toJSON(record: Record) {
//     return {
//         full: record.__source_data.acls__full || [],
//         edit: record.__source_data.acls__edit || [],
//         read: record.__source_data.acls__read || [],
//         deny: record.__source_data.acls__deny || [],
//     };
// }