import _ from 'lodash';
import chai from 'chai';
import fs from 'fs-extra';

// Classes
import { Schema } from '../classes/schema';
import { Column } from '../classes/column';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';
import { Filter } from './filter';
import { FilterJson } from './filter';
import { System } from '../classes/system';

export class SystemMeta {
    // Cache known schema and column names
    public readonly schemas: _.Dictionary<Schema> = {};

    constructor(private readonly __system: System) {}

    async startup(): Promise<void> {
        let select_data = async (schema_name: string) => {
            return this.__system.knex.select(schema_name, ['*']);
        };

        // Process system schemas
        for(let schema_data of await select_data('schema')) {
            let schema = new Schema(schema_data);

            // Add to local cache
            _.set(this.schemas, schema.schema_name, schema);
        }

        for(let column_data of await select_data('column')) {
            let schema = _.get(this.schemas, column_data.schema_name);
            let column = new Column(column_data, schema);

            // Add to schema
            _.set(schema.columns, column.column_name, column);
        }
    }


    isSchema(schema_name: string): boolean {
        return _.has(this.schemas, schema_name);
    }

    toSchema(schema_name: string): Schema {
        let schema = this.schemas[schema_name];

        if (schema === undefined) {
            throw `Schema '${schema_name}' not found/loaded`;
        }

        return schema;
    }

    toFilter(schema_name: string, filter_data: _.Dictionary<any>): Filter {
        let record_data = _.merge(filter_data, { schema_name: schema_name });
        let record = new Record('filter').fromRecordFlat(record_data);
        return new Filter(record);
    }

    toChange(schema_name: string, change_data: Partial<RecordJson>[]): Record[] {
        return change_data.map(change => new Record(schema_name).fromRecordJson(change));
    }
}
