import _ from 'lodash';

// Classes
import { Filter } from '../classes/filter';
import { KnexDriver } from '../classes/knex';
import { Schema } from '../classes/schema';
import { Column } from '../classes/column';
import { System } from '../classes/system';

// Layouts
import { SchemaName } from '../layouts/schema';


export class SystemMeta {
    // Cache known schema and column names
    public readonly schemas: _.Dictionary<Schema> = {};

    constructor(private readonly system: System) {}

    async startup(): Promise<void> {
        let select_data = async (schema_name: SchemaName) => {
            return KnexDriver(schema_name).whereIn('ns', this.system.namespaces).select();
        };

        // Process system schemas
        for(let schema_data of await select_data('system_data.schema')) {
            let schema = new Schema(schema_data);

            // Add to local cache
            this.schemas[schema.schema_name] = schema;
        }

        for(let column_data of await select_data('system_data.column')) {
            let schema = _.get(this.schemas, column_data.schema_name);
            let column = new Column(column_data, schema);

            // Add to schema
            schema.columns[column.column_name] = column;
        }
    }

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
            throw `Schema '${schema_name}' not found/loaded`;
        }

        return schema;
    }

    toFilter(schema_name: Schema | SchemaName, filter_data: _.Dictionary<any>): Filter {
        return new Filter(this.toSchema(schema_name).schema_name, filter_data);
    }
}
