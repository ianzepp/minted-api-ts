import _ from 'lodash';
import assert from 'assert';

import { Record } from '../classes/record';
import { RecordMeta } from '../types/record';

export class RecordProxyMeta implements RecordMeta {
    created_at: Date | null;
    created_by: string | null;
    updated_at: Date | null;
    updated_by: string | null;
    trashed_at: Date | null;
    trashed_by: string | null;

    constructor(record: Record) {
        // @ts-ignore
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
    return record.__source_data['meta__' + p];
}

function set(record: Record, p: string | number | symbol, v: any) {
    assert(typeof p === 'string', String(p));
    record.__source_data['meta__' + p] = v;
    return true;
}

function has(record: Record, p: string | number | symbol) {
    assert(typeof p === 'string', String(p));
    return record.__source_data['meta__' + p] !== undefined;
}

function toJSON(record: Record) {
    let source = _.assign({}, record.__source_prev, record.__source_data);

    return {
        created_at: source.meta__created_at || null,
        created_by: source.meta__created_by || null,
        updated_at: source.meta__updated_at || null,
        updated_by: source.meta__updated_by || null,
        trashed_at: source.meta__trashed_at || null,
        trashed_by: source.meta__trashed_by || null,
    };
}