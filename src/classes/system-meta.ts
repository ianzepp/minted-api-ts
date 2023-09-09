import _ from 'lodash';

// Classes
import { Filter } from '../classes/filter';
import { Schema } from '../classes/schema';
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

    constructor(private readonly system: System) {}

    async startup(): Promise<void> {
        // Process system schemas
        for(let schema_data of await this.select('schema')) {
            let schema_name = schema_data.schema_name;
            
            this.schemas[schema_name] = new Schema(schema_data);
        }

        for(let column_data of await this.select('column')) {
            let schema = _.get(this.schemas, column_data.schema_name);
            let column = new Column(column_data, schema);

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

    private async select(schema_name: SchemaName) {
        return this.system.knex.driver(`system_data.${schema_name} as data`)
            .join(`system_meta.${schema_name} as meta`, 'meta.id', 'data.id')
            .whereIn('data.ns', this.system.auth.namespaces)
            .whereNull('meta.expired_at')
            .whereNull('meta.deleted_at')
            .select();
    };

    isSchema(schema_name: string): boolean {
        return _.has(this.schemas, schema_name);
    }

    toSchema(schema_name: Schema | SchemaName): Schema {
        let schema: Schema | undefined;

        if (schema_name instanceof Schema) {
            schema = schema_name;
        }

        else {
            schema = this.schemas[schema_name];
        }

        if (schema === undefined) {
            throw new SchemaNotFoundError(schema_name as string);
        }

        return schema;
    }

    toFilter(schema_name: Schema | SchemaName, filter_data: _.Dictionary<any>): Filter {
        return new Filter(this.toSchema(schema_name).schema_name, filter_data);
    }
}
