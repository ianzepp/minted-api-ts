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
    private readonly __schema_dict: _.Dictionary<Schema> = {};
    private readonly __column_dict: _.Dictionary<Column> = {};

    constructor(private readonly __system: System) {}

    async startup(): Promise<void> {
        let select_data = async (schema_name: string) => {
            return this.__system.knex.select(schema_name, ['*']).then(results => {
                return _.map(results, source => {
                    return new Record(schema_name).fromRecordFlat(source);
                });
            });
        }

        // Load from DB
        let schemas = _.map(await select_data('schema'), source => new Schema(source));
        let columns = _.map(await select_data('column'), source => new Column(source));

        // Add to the known dict data
        _.each(schemas, schema => this.__schema_dict[schema.toFullName()] = schema);
        _.each(columns, column => this.__column_dict[column.toFullName()] = column);

        // Post-process columns
        for(let column_name in this.__column_dict) {
            let column = this.__column_dict[column_name];
            let schema = this.__schema_dict[column.schema_name];

            // Orphaned column?
            if (schema === undefined) {
                continue;
            }

            // Bidirectional link
            column.schema = schema;
            schema.columns_map[column.column_name] = column;
        }
    }


    isSchema(schema_name: string): boolean {
        return this.__schema_dict[schema_name] instanceof Schema;
    }

    isColumn(column_name: string): boolean {
        return this.__column_dict[column_name] instanceof Column;
    }

    toSchema(schema_name: string): Schema {
        let schema = this.__schema_dict[schema_name];

        if (schema === undefined) {
            throw `Schema '${schema_name}' not found/loaded`;
        }

        return schema;
    }

    toColumn(schema_name: string, column_name: string): Column | undefined {
        return this.__column_dict[schema_name + '.' + column_name];
    }

    toFilter(schema_name: string, filter_data: _.Dictionary<any>): Filter {
        let record_data = _.merge(filter_data, { schema_name: schema_name });
        let record = new Record('filter').fromRecordFlat(record_data);
        return new Filter(record);
    }

    toChange(schema_name: string, change_data: Partial<RecordJson>[]): Record[] {
        return change_data.map(change => new Record(schema_name).fromRecordJson(change));
    }

    describe(): Object {
        let result = {
            schemas: this.__schema_dict,
            columns: this.__column_dict
        };

        // Type convert
        return JSON.parse(JSON.stringify(result));
    }

    async import(source: unknown): Promise<void> {
        // ...
    }

    async export(): Promise<Object> {
        return {
            schemas: _.map(this.__schema_dict, schema => schema.toJSON()),
            columns: _.map(this.__column_dict, column => column.toJSON()),
        };
    }
}
