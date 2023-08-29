import _ from 'lodash';
import chai from 'chai';
import fs from 'fs-extra';

// Classes
import { Schema } from '../classes/schema';
import { Column } from '../classes/column';
import { RecordJson } from '../classes/record';
import { System } from '../classes/system';

export class SystemMeta {
    // Cache known schema and column names
    private readonly _schema_dict: _.Dictionary<Schema> = {};
    private readonly _column_dict: _.Dictionary<Column> = {};

    constructor(private readonly system: System) {}

    async startup() {
        // Select all available system schemas, using raw knex
        let schemas = await this.system.knex.toKnex('schema').select().returning('*');
        let columns = await this.system.knex.toKnex('column').select().returning('*');

        // Add to the known dict data
        _.each(schemas, schema => this.intakeSchema({ type: 'schema', data: schema, info: {}, acls: {} }));
        _.each(schemas, column => this.intakeSchema({ type: 'column', data: column, info: {}, acls: {} }));
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

    toColumn(column_name: string): Column {
        return this._column_dict[column_name];
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

    private intakeSchema(source: RecordJson): void {
        this._schema_dict[source.data.schema_name] = new Schema(source);
    }

    private intakeColumn(source: RecordJson): void {
        this._column_dict[source.data.schema_name + '.' + source.data.column_name] = new Column(source);
    }
}