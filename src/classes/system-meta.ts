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
    private readonly _schema_dict: _.Dictionary<Schema> = {};
    private readonly _column_dict: _.Dictionary<Column> = {};

    constructor(private readonly system: System) {}

    async startup() {
        let select_data = async (schema_name: string) => {
            return this.system.knex.select(schema_name, ['*']).then(results => {
                return _.map(results, source => {
                    return new Record(schema_name).fromRecordFlat(source);
                });
            });
        }

        let schemas = _.map(await select_data('schema'), source => new Schema(source));
        let columns = _.map(await select_data('column'), source => new Column(source));

        // Add to the known dict data
        _.each(schemas, schema => this._schema_dict[schema.schema_name] = schema);
        _.each(columns, column => this._column_dict[column.schema_name + '.' + column.column_name] = column);
    }


    isSchema(schema_name: string): boolean {
        return this._schema_dict[schema_name] instanceof Schema;
    }

    isColumn(column_name: string): boolean {
        return this._column_dict[column_name] instanceof Column;
    }

    toSchema(schema_name: string): Schema {
        let schema = this._schema_dict[schema_name];

        if (schema === undefined) {
            throw `Schema '${schema_name}' not found/loaded`;
        }

        return schema;
    }

    toColumn(schema_name: string, column_name: string): Column | undefined{
        return this._column_dict[schema_name + '.' + column_name];
    }

    toFilter(schema_name: string, filter_data: _.Dictionary<any>) {
        let record_data = _.merge(filter_data, { schema_name: schema_name });
        let record = new Record('filter').fromRecordFlat(record_data);
        return new Filter(record);
    }

    toChange(schema_name: string, change_data: Partial<RecordJson>[]) {
        return change_data.map(change => new Record(schema_name).fromRecordJson(change));
    }

    toColumnsOf(schema_name: string): Column[] {
        let search = schema_name + '.';

        return _.transform(this._column_dict, (result, v, k) => {
            if (k.startsWith(search)) {
                result.push(v);
            }
        }, [] as Column[]);
    }

    describe(): Object {
        let result = {
            schemas: this._schema_dict,
            columns: this._column_dict
        };

        // Type convert
        return JSON.parse(JSON.stringify(result));
    }

    async import(source: unknown) {
        
    }

    async export() {
        return {
            schemas: _.map(this._schema_dict, schema => schema.toJSON()),
            columns: _.map(this._column_dict, column => column.toJSON()),
        };
    }
}
