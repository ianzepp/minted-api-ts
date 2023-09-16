import _ from 'lodash';
import { assert, expect } from 'chai';

// Classes
import { Column } from '@classes/column';
import { Schema } from '@classes/schema';

// Typedefs
import { ColumnType } from '@typedefs/column';
import { ColumnsMeta } from '@typedefs/column';
import { SchemaName } from '@typedefs/schema';

// Helpers
import { toNull } from '@classes/helpers';
import { toJSON } from '@classes/helpers';


//
// Record proxies. Wizard stuff.
//

function createProxy(schema: Schema, source_type: 'data' | 'meta' | 'acls') {
    // Define default target values
    let source: _.Dictionary<any> = {};

    if (source_type === 'data') {
        // no defaults
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

        // ACLs are in metadata for now
        source.acls_full = null;
        source.acls_edit = null;
        source.acls_read = null;
        source.acls_deny = null;
    }

    let assertFn = (name: string) => {
        if (source_type === 'data' && name === 'id') {
            return;
        }

        if (source_type === 'data' && name === 'ns') {
            return;
        }

        if (source_type === 'data' && schema.has(name)) {
            return;
        }

        if (source_type === 'meta' && ColumnsMeta.includes(name)) {
            return;
        }

        assert.fail(`schema '${schema.name}' column '${name}' is invalid for 'record.${source_type}'`);
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
    public readonly type: SchemaName;

    // Containers
    public readonly data: _.Dictionary<any>;
    public readonly prev: _.Dictionary<any>;
    public readonly meta: _.Dictionary<any>;

    // Related objects
    constructor(public readonly schema: Schema) {
        this.data = createProxy(schema, 'data');
        this.prev = createProxy(schema, 'data');
        this.meta = createProxy(schema, 'meta');
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
        return `${this.schema.name}#${this.data.id}`;
    }

    toJSON() {
        return {
            data: this.data,
            meta: this.meta,
        };
    }

    is(schema_name: SchemaName) {
        return this.schema.is(schema_name);
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