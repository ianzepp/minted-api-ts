import _ from 'lodash';
import assert from 'assert';

import { Record } from '../classes/record';
import { RecordData } from '../types/record';

export class RecordProxyData implements RecordData {
    [index: string]: any;

    constructor(record: Record) {
        return new Proxy(record, {
            get: get,
            set: set,
            has: has,
        });
    }
}

function get(record: Record, p: string | number | symbol) {
    if (p === 'toJSON' || p === Symbol.toStringTag) {
        return () => toJSON(record);
    }

    assert(typeof p === 'string', String(p));
    assert(p.startsWith('acls__') === false, p);
    assert(p.startsWith('meta__') === false, p);

    let data = record.__source_data[p];
    let prev = record.__source_prev[p];

    if (data !== undefined) {
        return data;
    }

    if (prev !== undefined) {
        return prev;
    }

    return null;
}

function set(record: Record, p: string | number | symbol, v: any) {
    assert(typeof p === 'string', String(p));
    assert(p.startsWith('acls__') === false, p);
    assert(p.startsWith('meta__') === false, p);

    record.__source_data[p] = v;
    return true;
}

function has(record: Record, p: string | number | symbol) {
    assert(typeof p === 'string', String(p));
    assert(p.startsWith('acls__') === false, p);
    assert(p.startsWith('meta__') === false, p);
    return record.__source_data[p] !== undefined || record.__source_prev[p] !== undefined;
}

function toJSON(record: Record) {
    let source = _.assign({}, record.__source_prev, record.__source_data);

    return _.transform(source, (result, v, p) => {
        if (p.startsWith('meta__')) {
            return result;
        }

        if (p.startsWith('acls__')) {
            return result;
        }

        return _.set(result, p, v);
    }, {});
}