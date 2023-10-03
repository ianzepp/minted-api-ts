import _ from 'lodash';
import { assert, expect } from 'chai';

// Classes
import { Column } from '@classes/column';
import { Object } from '@classes/object';

// Typedefs
import { ColumnType, ColumnsAcls } from '@typedefs/column';
import { ColumnsMeta } from '@typedefs/column';
import { ObjectName } from '@typedefs/object';

// Helpers
import { toNull } from '@classes/helper';
import { toJSON } from '@classes/helper';


//
// Record proxies. Wizard stuff.
//

function createProxy(object: Object, source_type: 'data' | 'meta' | 'acls') {
    // Define default target values
    let source: _.Dictionary<any> = {};

    if (source_type === 'data') {
        source.id = null;
    }

    if (source_type === 'meta') {
        source.created_at = null;
        source.created_by = null;
        source.updated_at = null;
        source.updated_by = null;
        source.expired_at = null;
        source.expired_by = null;
        source.deleted_at = null;
        source.deleted_by = null;
    }

    if (source_type === 'acls') {
        source.access_full = null;
        source.access_edit = null;
        source.access_read = null;
        source.access_deny = null;
    }

    let assertFn = (name: string) => {
        if (source_type === 'data' && name === 'id') {
            return;
        }

        if (source_type === 'data' && name === 'ns') {
            return;
        }

        if (source_type === 'data' && object.has(name)) {
            return;
        }

        if (source_type === 'meta' && ColumnsMeta.includes(name)) {
            return;
        }

        if (source_type === 'acls' && ColumnsAcls.includes(name)) {
            return;
        }

        assert.fail(`object '${object.name}' column '${name}' is invalid for 'record.${source_type}'`);
    }

    // Build and return the new Proxy
    return new Proxy(source, {
        ownKeys(target: _.Dictionary<any>) {
            return Reflect.ownKeys(target);
        },

        get(target: _.Dictionary<any>, name: string) {
            if (name === 'toJSON') return target;
            if (name === 'constructor') return undefined;
            if (name === 'length') return undefined;
            assertFn(name);
            return target[name] ?? null;
        },

        set(target: _.Dictionary<any>, name: string, data: any) {
            assertFn(name);
            target[name] = data;
            return true;
        }
    });
}

/**
 * The Record class represents a record in the database.
 * It contains data, previous data, and metadata about the record.
 * The class provides methods to manipulate and access the data.
 */
export class Record {
    public readonly type: ObjectName;

    // Containers
    public readonly data: _.Dictionary<any>;
    public readonly prev: _.Dictionary<any>;
    public readonly meta: _.Dictionary<any>;
    public readonly acls: _.Dictionary<any>;

    // Related objects
    constructor(public readonly object: Object) {
        this.data = createProxy(object, 'data');
        this.prev = createProxy(object, 'data');
        this.meta = createProxy(object, 'meta');
        this.acls = createProxy(object, 'acls');
    }

    get diff() {
        // diff = the accumulated difference between objects
        // k = the column name / key value
        // dv = the value of the column in the `.data` property
        // pv = the value of the column in the `.prev` property
        //
        // Note: the returned object will always contain the `id` value

        return _.transform(this.data, (diff, dv, k) => {
            let pv = this.prev[k];

            // No change in value or type
            if (pv === dv) {
                return diff;
            }

            return _.set(diff, k, dv);
        }, { id: this.data.id } as _.Dictionary<any>);
    }

    get created() {
        return this.data.created_at !== null;
    }

    get updated() {
        return this.data.updated_at !== null;
    }

    get expired() {
        return this.data.expired_at !== null;
    }

    toString(): string {
        return `${this.object.name}#${this.data.id}`;
    }

    toJSON() {
        return {
            data: this.data,
            meta: this.meta,
            acls: this.acls,
        };
    }

    is(object_name: ObjectName) {
        return this.object.is(object_name);
    }

    has(column: Column): boolean {
        return this.data[column.column_name]
            || this.prev[column.column_name];
    }

    get(column: Column) {
        return this.data[column.column_name] ?? null;
    }

    old(column: Column) {
        return this.prev[column.column_name] ?? null;
    }

    set(column: Column, data: any) {
        return this.data[column.column_name] = data;
    }
}