import _ from 'lodash';
import util from 'util';

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

    public readonly schema_name: string;
    public readonly schema_type: string;
    public readonly description: string | null;
    public readonly metadata: boolean;

    constructor(flat: _.Dictionary<any>) {
        this.id = flat.id;
        this.ns = flat.ns;

        this.schema_name = flat.schema_name;
        this.schema_type = flat.schema_type;
        this.description = flat.description ?? null;
        this.metadata = flat.metadata ?? false;
    }

    column_keys(prefix?: string) {
        return Array.from(this.columns.keys()).map(k => {
            return prefix ? prefix + '.' + k : k;
        });
    }

    is(schema_name: string) {
        return this.schema_name === schema_name;
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

    /**
     * Describes the `Schema` data structure in the common format
     * @returns object
     */

    describe() {
        return {
            type: SchemaType.Schema,
            data: {
                schema_name: this.schema_name,
                description: this.description,
            },

            columns: [] // TODO
        }
    }

    //
    // Export as GraphQL
    //

    describeGQL() {
        let schema_format = `type %s {\n%s\n}`;
        let column_format = `\t%s: %s%s;`;

        // Convert columns to GQL format
        let columns = this.column_keys().map(column_name => {
            let column = this.columns.get(column_name);

            // Setup
            let n = column.column_name;
            let r = column.required ? '!' : '';
            let t = column.column_type;

            if (t === 'text') {
                return util.format(column_format, n, 'String', r);
            }

            if (t === 'boolean') {
                return util.format(column_format, n, 'Boolean', r);
            }

            if (t === 'integer') {
                return util.format(column_format, n, 'Int', r);
            }

            return '';
        });
        
        // Generate format
        return util.format(schema_format, this.schema_name, columns.join('\n'));
    }
}
