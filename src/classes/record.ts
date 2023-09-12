import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '@classes/column';
import { Schema } from '@classes/schema';

// Layouts
import { ColumnType } from '@layouts/column';
import { RecordAcls } from '@layouts/record';
import { RecordData } from '@layouts/record';
import { RecordFlat } from '@layouts/record';
import { RecordJson } from '@layouts/record';
import { RecordMeta } from '@layouts/record';
import { SchemaName } from '@layouts/schema';

// Helpers
import { toJSON } from '@classes/helpers';


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

    // Containers
    public readonly data: any = {};
    public readonly prev: any = {};
    public readonly meta: any = {};

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

    toString(): string {
        return `${this.schema.schema_name}#${this.data.id}`;
    }

    toJSON(): RecordJson {
        return toJSON<RecordJson>({
            type: this.schema.schema_name,
            data: this.data,
            meta: this.meta,
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

    get<T = any>(column: Column): T | null {
        return this.data[column.column_name] ?? null;
    }

    old<T = any>(column: Column): T | null {
        return this.prev[column.column_name] ?? null;
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