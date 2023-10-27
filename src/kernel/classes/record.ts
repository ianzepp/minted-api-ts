import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '@kernel/classes/column';
import { Object } from '@kernel/classes/object';

// Typedefs
import { ColumnsAcls } from '@system/typedefs/column';
import { ColumnsMeta } from '@system/typedefs/column';
import { ErrorTrace } from './errors';

//
// Typedefs
//

/** The ID of a record in UUID format */
export type UUID = string;

/** Represents the flat JSON data of a Record. */
export interface RecordFlat extends _.Dictionary<any> {}

/** Represents the data of a record. */
export interface RecordData extends _.Dictionary<any> {
    id: string | null;
    ns: string | null;
}

export interface RecordMeta {
    /** Timestamp when the record was created. */
    created_at: Date | null;

    /** User ID that created the record. */
    created_by: UUID;

    /** Timestamp when the record was updated. */
    updated_at: Date;

    /** User ID that created the record, or the last User ID to update the record. */
    updated_by: UUID;

    /** Timestamp when the record was expired. */
    expired_at: Date;

    /** User ID that expired the record, or `null` if the record was not expired. */
    expired_by: UUID | null;

    /** Timestamp when the record was deleted, or `null` if the record was not deleted */
    deleted_at: Date;

    /** User ID that deleted the record, or `null` if the record was not deleted */
    deleted_by: UUID | null;
}

/** Represents the access rights of various users of the record. */
export interface RecordAcls {
    /** The User IDs with full access. */
    access_full: UUID[];

    /** The User IDs with edit access. */
    access_edit: UUID[];

    /** The User IDs with read access. */
    access_read: UUID[];

    /** The User IDs denied access. */
    access_deny: UUID[];
}

/** Represents the record's JSON representation in object format. */
export interface RecordJson {
    /** The string value of the parent object type */
    type: string;
    
    /** Accessor to the key/value mapping of record properties with their values. */
    data: RecordData;

    /** Accessor to the set of timestamp and access information describing this record. */
    meta?: RecordMeta;

    /** Accessor to the set of access control lists for this record */
    acls?: RecordAcls;
}

/** Defines the column names that apply to the `meta` record property */
export const RecordMetaColumns = [
    'created_at',
    'created_by',
    'updated_at',
    'updated_by',
    'expired_at',
    'expired_by',
    'deleted_at',
    'deleted_by',
];

/** Defines the column names that apply to the `acls` record property */
export const RecordAclsColumns = [
    'access_full',
    'access_edit',
    'access_read',
    'access_deny',
];

/** Defines the allowable types for database change operations. */
export type ChangeData = Record | RecordFlat | RecordData | RecordJson;

// Implementation
export class Record {
    public readonly data: _.Dictionary<any>;
    public readonly prev: _.Dictionary<any>;
    public readonly meta: _.Dictionary<any>;
    public readonly acls: _.Dictionary<any>;

    // Related objects
    constructor(public readonly object: Object, source?: Record | ChangeData) {
        this.data = RecordProxy(object, 'data');
        this.prev = RecordProxy(object, 'data');
        this.meta = RecordProxy(object, 'meta');
        this.acls = RecordProxy(object, 'acls');

        // Import any source data
        this.import(source);
    }

    get object_name() {
        return this.object.system_name;
    }

    get reference() {
        return this.object_name + '(name=' + this.data.rn + ', id=' + this.data.id + ')';
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

    static isMetaColumn(column_name: string) {
        return RecordMetaColumns.includes(column_name);
    }

    static isAclsColumn(column_name: string) {
        return RecordAclsColumns.includes(column_name);
    }

    import(source?: Record | ChangeData) {
        console.trace('import()', source);

        if (source === undefined) {
            return;
        }

        else if (source instanceof Record) {
            _.assign(this.data, source.data);
            _.assign(this.prev, source.prev);
            _.assign(this.meta, source.meta);
            _.assign(this.acls, source.acls);
        }

        else if (isRecordJson(source)) {
            _.assign(this.data, source.data);
            _.assign(this.meta, source.meta);
            _.assign(this.acls, source.acls);
        }

        else if (isRecordFlat(source)) {
            _.assign(this.data, _.omit(source, ColumnsMeta, ColumnsAcls));
            _.assign(this.meta, _.pick(source, ColumnsMeta));
            _.assign(this.acls, _.pick(source, ColumnsAcls));            
        }

        else if (isRecordDict(source)) {
            _.assign(this.data, _.omit(source, ColumnsMeta, ColumnsAcls));            
        }

        else {
            console.warn('Unsupported record source format:', source);
        }
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

    is(object_name: string) {
        return this.object.inherits(object_name);
    }

    has(column: Column): boolean {
        return this.data[column.column_name] || this.prev[column.column_name];
    }

    set(column: Column, data: any) {
        return this.data[column.column_name] = data;
    }

    get(column: Column) {
        return this.data[column.column_name] ?? null;
    }

    old(column: Column) {
        return this.prev[column.column_name] ?? null;
    }

    expect(column: Column | string, accessor: 'data' | 'meta' | 'acls' = 'data') {
        if (column instanceof Column) {
            column = column.column_name;
        }

        return chai.expect(this[accessor], this.reference + `: property '${ column }'`).property(column);
    }
}

export function RecordProxy(object: Object, source_type: 'data' | 'meta' | 'acls') {
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
            if (['id', 'ns', 'rn'].includes(column_name)) return;
            if (_.has(object.columns, column_name)) return;
        }

        if (source_type === 'meta') {
            if (ColumnsMeta.includes(column_name)) return;
        }

        if (source_type === 'acls') { 
            if (ColumnsAcls.includes(column_name)) return;
        }

        throw new ErrorTrace(`Column name "${ column_name }" not found for object "${ object.system_name }": Valid "${ source_type }" columns are ${ JSON.stringify(object.column_keys) }`);
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

export function isRecordJson(source: any) {
    return _.isPlainObject(source)
        && _.isPlainObject(source.data)
        && _.isString(source.type);
}

export function isRecordFlat(source: any) {
    return _.isPlainObject(source)
        && _.isString(source.id)
        && _.isString(source.ns);
}

export function isRecordDict(source: unknown) {
    return _.isPlainObject(source);
}

