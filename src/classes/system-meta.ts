import _ from 'lodash';
import chai from 'chai';
import fs from 'fs-extra';

// Classes
import { Schema } from '../classes/schema';
import { Column } from '../classes/column';
import { RecordJson } from '../classes/record';
import { System } from '../classes/system';

// Builtins
const SchemaJson = fs.readJsonSync('src/classes/schema.json');
const ColumnJson = fs.readJsonSync('src/classes/column.json');

const SCHEMAS_PROXY_HANDLER = {
    get: (t: SystemMeta, p: string | number | symbol) => {
        if (typeof p === 'string') {
            return t.toSchema(p);
        }
    }
}; 

export class SystemMeta {
    // Cache known schema and column names
    private readonly _schema_dict: _.Dictionary<Schema> = {};
    private readonly _column_dict: _.Dictionary<Column> = {};

    constructor(private readonly system: System) {}

    async startup() {
        this.intakeSchema(SchemaJson);
        this.intakeSchema(ColumnJson);

        // Select all available system schemas 
        let schemas = await this.system.data.selectAll('schema', {});
        let columns = await this.system.data.selectAll('column', {});

        // Add to the known dict data
        _.each(schemas, schema => this.intakeSchema(schema));
        _.each(columns, column => this.intakeColumn(column));
    }

    /**
     * Checks if the given schema name exists in the schema dictionary.
     * @param schema_name - The name of the schema to check.
     * @returns Returns true if the schema exists, false otherwise.
     */
    isSchema(schema_name: string): boolean {
        return this._schema_dict[schema_name] instanceof Schema;
    }

    /**
     * Checks if the given column name exists in the column dictionary.
     * @param column_name - The name of the column to check.
     * @returns Returns true if the column exists, false otherwise.
     */
    isColumn(column_name: string): boolean {
        return this._column_dict[column_name] instanceof Column;
    }

    /**
     * Retrieves the schema associated with the given schema name.
     * @param schema_name - The name of the schema to retrieve.
     * @returns The schema associated with the given name.
     */
    toSchema(schema_name: string): Schema {
        let schema = this._schema_dict[schema_name];

        if (schema === undefined) {
            throw `Schema '${schema_name}' not found/loaded`;
        }

        return schema;
    }

    /**
     * Retrieves the column associated with the given column name.
     * @param column_name - The name of the column to retrieve.
     * @returns The column associated with the given name.
     */
    toColumn(column_name: string): Column {
        return this._column_dict[column_name];
    }

    /**
     * Retrieves all columns associated with the given schema name.
     * @param schema_name - The name of the schema to retrieve columns for.
     * @returns An array of columns associated with the given schema name.
     */
    toColumnsOf(schema_name: string): Column[] {
        let search = schema_name + '.';

        return _.transform(this._column_dict, (result, v, k) => {
            if (k.startsWith(search)) {
                result.push(v);
            }
        }, [] as Column[]);
    }

    /**
     * Describes the current state of the system meta.
     * @returns An object containing the current state of the system meta.
     */
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

    /**
     * Intakes a new schema into the system meta.
     * @param source_name - The name of the source schema.
     * @param source - The source schema to intake.
     */
    private intakeSchema(source: RecordJson): void {
        this._schema_dict[source.data.schema_name] = new Schema(source);
    }

    /**
     * Intakes a new column into the system meta.
     * @param source_name - The name of the source column.
     * @param source - The source column to intake.
     */
    private intakeColumn(source: RecordJson): void {
        this._column_dict[source.data.schema_name + '.' + source.data.column_name] = new Column(source);
    }
}