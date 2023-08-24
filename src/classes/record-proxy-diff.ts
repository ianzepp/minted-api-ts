import _ from 'lodash';
import assert from 'assert';

import { Record } from '../classes/record';
import { RecordData } from '../classes/record';

export class RecordProxyDiff implements Readonly<Partial<RecordData>> {
    constructor(record: Record) {
        return new Proxy(record, {
            get: get,
        });
    }
}

function get(record: Record, p: string | number | symbol) {
    if (p === 'toJSON' || p === Symbol.toStringTag) {
        return () => toJSON(record);
    }

    assert(typeof p === 'string', String(p));
    assert.notEqual(p.startsWith('acls__'), true);
    assert.notEqual(p.startsWith('meta__'), true);

    let data = record.__source_data[p];
    let prev = record.__source_prev[p];

    if (prev === data) {
        return undefined;
    }

    if (prev === undefined && data === undefined) {
        return undefined;
    }

    if (prev instanceof Date && data instanceof Date && prev.toISOString() == data.toISOString()) {
        return undefined;
    }

    return data;
}

function toJSON(record: Record) {
    return;
}