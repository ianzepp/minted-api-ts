import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '../classes/column';
import { Schema } from '../classes/schema';

// Layouts
import { ColumnType } from '../layouts/column';
import { RecordAcls } from '../layouts/record';
import { RecordData } from '../layouts/record';
import { RecordFlat } from '../layouts/record';
import { RecordJson } from '../layouts/record';
import { RecordMeta } from '../layouts/record';
import { SchemaName } from '../layouts/schema';

// Helpers
import toJSON from '../helpers/toJSON';


export class Record implements RecordJson {
    public static ColumnsInfo = [
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'expired_at',
        'expired_by',
        'deleted_at',
        'deleted_by',
    ];
    
    public static ColumnsAcls = [
        'acls_full',
        'acls_edit',
        'acls_read',
        'acls_deny',
    ];
    
    public readonly type: SchemaName;
    
    public readonly data: RecordData = {
        id: null,
        ns: null,
    };

    public readonly meta: RecordMeta = {
        created_at: null,
        created_by: null,
        updated_at: null,
        updated_by: null,
        expired_at: null,
        expired_by: null,
        deleted_at: null,
        deleted_by: null,
    };

    public readonly acls: RecordAcls = {
        acls_full: null,
        acls_edit: null,
        acls_read: null,
        acls_deny: null,
    };

    public readonly prev: RecordData = {
        id: null,
        ns: null,
    };

    // Related objects
    constructor(public readonly schema: Schema) {}

    get diff(): Partial<RecordData> {
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
        }, { id: this.data.id } as Partial<RecordData>);
    }

    // Used for a internal record-to-record copy
    fromRecord(source: Record): this {
        _.assign(this.data, source.data);
        _.assign(this.prev, source.prev);
        _.assign(this.meta, source.meta);
        _.assign(this.acls, source.acls);
        return this;
    }

    // Used when importing from API-submitted http requests (partial representation with `.data` values only)
    fromRecordData(source: RecordData): this {
        _.assign(this.data, source);
        return this;
    }

    // Used when importing from API-submitted http requests
    fromRecordJson(source: Partial<RecordJson>): this {
        _.assign(this.data, source.data);
        _.assign(this.meta, source.meta);
        _.assign(this.acls, source.acls);
        return this;
    }

    // Used when converting from a flat knex data structure to a proper Record
    fromRecordFlat(source: RecordFlat): this {
        _.assign(this.data, _.omit(source, Record.ColumnsInfo, Record.ColumnsAcls));
        _.assign(this.meta, _.pick(source, Record.ColumnsInfo));
        _.assign(this.acls, _.pick(source, Record.ColumnsAcls));
        return this;
    }

    // Used when imported prev data from knex
    fromRecordPrev(source: RecordFlat): this {
        _.assign(this.prev, _.omit(source, Record.ColumnsInfo, Record.ColumnsAcls));
        _.assign(this.meta, _.pick(source, Record.ColumnsInfo));
        _.assign(this.acls, _.pick(source, Record.ColumnsAcls));
        return this;
    }

    toString(): string {
        return `${this.schema.schema_name}#${this.data.id}`;
    }

    toJSON(): RecordJson {
        return toJSON<RecordJson>({
            type: this.type,
            data: this.data,
            meta: this.meta,
            acls: this.acls,
        });
    }

    expect(path?: string): Chai.Assertion {
        if (path === undefined) {
            return chai.expect(this);
        }

        else {
            return chai.expect(this).nested.property(path);
        }
    }

    //
    // Column helpers
    // 

    has(column: Column): boolean {
        return !!this.data[column.column_name];
    }

    get<T = any>(column: Column): T {
        return this.data[column.column_name];
    }

    set<T = any>(column: Column, data: T) {
        // Setup test
        let test = chai.expect(data, column.column_name);

        if (data === undefined) {
            return; // cannot unset a value
        }

        else if (column.column_type == ColumnType.Boolean) {
            test.is('boolean');
        }

        else if (data === null && column.required === false) {
            // null is allowable for the rest of the data types
        }

        else if (column.column_type == ColumnType.Decimal) {
            test.is('number');
        }

        else if (column.column_type == ColumnType.Integer) {
            test.is('number');
        }

        else if (column.column_type == ColumnType.Json) {
            test.is('object');
        }

        else if (column.column_type == ColumnType.Text) {
            test.is('string');
        }

        else if (column.column_type == ColumnType.Enum) {
            test.is('array');
        }

        else {
            throw new Error('Unsupported column type: ' + column.column_type)
        }

        // Set data
        this.data[column.column_name] = data;
    }
}