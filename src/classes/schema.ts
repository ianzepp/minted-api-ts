import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '@classes/column';
import { ColumnsMeta, Record } from '@classes/record';
import { toJSON } from '@classes/helpers';

// Typedefs
import { SchemaType } from '@typedefs/schema';


export class Schema {
    // Re-export aliases
    public static Type = SchemaType;

    // Public helpers
    public readonly columns: Map<string, Column> = new Map();

    // Properties
    public readonly id: string;
    public readonly ns: string;

    public readonly name: string;
    public readonly type: string;
    public readonly metadata: boolean;

    constructor(flat: _.Dictionary<any>) {
        this.id = flat.id;
        this.ns = flat.ns;

        this.name = flat.name;
        this.type = flat.type;
        this.metadata = flat.metadata;
    }

    column_keys(prefix?: string) {
        return Array.from(this.columns.keys()).map(k => {
            return prefix ? prefix + '.' + k : k;
        });
    }

    is(schema_name: string) {
        return this.name === schema_name;
    }
    
    toRecord(source?: any) {
        let record = new Record(this);

        if (source === undefined) {
            // do nothing
        }

        else if (source instanceof Record) {
            _.assign(record.data, source.data);
            _.assign(record.prev, source.prev);
            _.assign(record.meta, source.meta);
        }

        else if (this.isRecordJson(source)) {
            _.assign(record.data, source.data);
            _.assign(record.meta, source.meta);
        }

        else if (this.isRecordFlat(source)) {
            _.assign(record.data, _.omit(source, ColumnsMeta));
            _.assign(record.meta, _.pick(source, ColumnsMeta));
        }

        else if (this.isRecordDict(source)) {
            _.assign(record.data, _.omit(source, ColumnsMeta));
        }

        else {
            throw new Error('Unsupported "Record" source: ' + toJSON(source));
        }

        return record;
    }

    isRecordDict(source: unknown) {
        return typeof source === 'object'; 
    }

    isRecordJson(source: unknown) {
        return typeof source === 'object'
            && _.has(source, 'data')
            && _.has(source, 'meta');
    }

    isRecordFlat(source: unknown) {
        return typeof source === 'object'
            && _.has(source, 'id')
            && _.has(source, 'ns')
            && _.has(source, 'created_at')
            && _.has(source, 'updated_at')
            && _.has(source, 'expired_at')
            && _.has(source, 'acls_full')
            && _.has(source, 'acls_edit')
            && _.has(source, 'acls_read')
            && _.has(source, 'acls_deny');
    }
}
