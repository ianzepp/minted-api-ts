import _ from 'lodash';

// Classes
import { Filter } from '../classes/filter';
import { Schema, SchemaType } from '../classes/schema';
import { Column } from '../classes/column';
import { System } from '../classes/system';
import { SystemService } from '../classes/system';

// Layouts
import { SchemaName } from '../layouts/schema';

// Meta API errors
export class MetaError extends Error {};
export class SchemaNotFoundError extends MetaError {};
export class ColumnNotFoundError extends MetaError {};

// Implementation
export class SystemMeta implements SystemService {
    // Cache known schema and column names
    public readonly schemas: _.Dictionary<Schema> = {};
    public readonly columns: _.Dictionary<Column> = {};

    constructor(private readonly system: System) {}

    async startup(): Promise<void> {
        let select = async (schema_name: SchemaName) => {
            return this.system.knex.driver(`${schema_name} as data`)
                .join(`${schema_name}__meta as meta`, 'meta.id', 'data.id')
                .whereIn('data.ns', this.system.auth.namespaces)
                .whereNull('meta.expired_at')
                .whereNull('meta.deleted_at')
                .select();
        };

        // Process system schemas
        for(let schema_data of await select(SchemaType.Schema)) {
            let schema = new Schema(schema_data);

            // Add to internals
            this.schemas[schema.schema_name] = schema;
        }

        for(let column_data of await select(SchemaType.Column)) {
            let column = new Column(column_data);
            let schema = this.schemas[column.schema_name];

            // Add to internals
            this.columns[column.schema_name + '/' + column.column_name] = column;

            // Add to schema
            schema.columns[column.column_name] = column;
        }
    }
    
    async cleanup(): Promise<void> {
        _.forOwn(this.schemas, (value, key) => {
            delete this.schemas[key];
        });
    }

    async refresh() {
        await this.cleanup();
        await this.startup();
    }

    toSchema(schema_name: Schema | SchemaName): Schema {
        let schema: Schema | undefined;

        // Schema name is already a Schema instance?
        if (schema === undefined && schema_name instanceof Schema) {
            schema = schema_name;
        }

        // Schema name is a string? Perhaps it is full-qualified
        if (schema === undefined && typeof schema_name === 'string') {
            schema = this.schemas[schema_name];
        }

        // Schema name is perhaps in the `system` namespace?
        if (schema === undefined && typeof schema_name === 'string') {
            schema = this.schemas['system.' + schema_name];
        }

        // No schema found
        if (schema === undefined) {
            console.warn('schema not found:', schema_name);
            throw new SchemaNotFoundError(schema_name as string);
        }

        return schema;
    }

    toFilter(schema_name: Schema | SchemaName, filter_data: _.Dictionary<any>): Filter {
        return new Filter(this.toSchema(schema_name).schema_name, filter_data);
    }
}
