import _ from 'lodash';
import chai from 'chai';
import { assert, expect } from 'chai';

// Classes
import { Column } from '@system/classes/column';
import { Object } from '@system/classes/object';

// Typedefs
import { ColumnsAcls } from '@system/typedefs/column';
import { ColumnsMeta } from '@system/typedefs/column';
import { ObjectName } from '@system/typedefs/object';

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

    let assertFn = (column_name: string, op: 'get' | 'set') => {
        if (source_type === 'data') {
            if (['id', 'ns', 'name'].includes(column_name)) return;
            if (object.exists(column_name)) return;
        }

        if (source_type === 'meta') {
            if (ColumnsMeta.includes(column_name)) return;
        }

        if (source_type === 'acls') { 
            if (ColumnsAcls.includes(column_name)) return;
        }

        throw new Error(`Column name "${ column_name }" is invalid for the object type "${ object.system_name }" on "record.${ source_type }"`);
    }

    // Build and return the new Proxy
    return new Proxy(source, {
        ownKeys(target: _.Dictionary<any>) {
            return Reflect.ownKeys(target);
        },

        get(target: _.Dictionary<any>, column_name: string) {
            if (column_name === 'toJSON') return target;
            if (column_name === 'constructor') return undefined;
            if (column_name === 'length') return undefined;

            // Special cases
            if ((<unknown>column_name) === Symbol.toString) {
                return JSON.stringify(target);
            }

            if ((<unknown>column_name) === Symbol.toStringTag) {
                return JSON.stringify(target);
            }

            if ((<unknown>column_name) instanceof Symbol) {
                return undefined;
            }
    
            // Assert this column exists on the target
            assertFn(column_name, 'get');

            // Fetch and return
            return target[column_name] ?? null;
        },

        set(target: _.Dictionary<any>, column_name: string, data: any) {
            assertFn(column_name, 'set');
            target[column_name] = data;
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

    get object_name() {
        return this.object.system_name;
    }

    get reference() {
        return this.object_name + '(name=' + this.data.name + ', id=' + this.data.id + ')';
    }

    get type() {
        return this.object_name;
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

    toString(): string {
        return `${this.object_name}#${this.data.id}`;
    }

    toJSON() {
        return {
            type: this.object_name,
            data: this.data,
            meta: this.meta,
            acls: this.acls,
        };
    }

    toData() {
        return this.data;
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

    expect(column: Column | string, accessor: 'data' | 'meta' | 'acls' = 'data') {
        if (column instanceof Column) {
            column = column.column_name;
        }

        return chai.expect(this[accessor], this.reference + `: property '${ column }'`).property(column);
    }
}