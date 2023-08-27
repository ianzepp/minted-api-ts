import _ from 'lodash';
import chai from 'chai';
import path from 'path';
import fs from 'fs';

// Classes
import { Schema } from '../classes/schema';
import { SchemaJson } from '../classes/schema';
import { Column } from '../classes/column';
import { ColumnJson } from '../classes/column';
import { System } from '../classes/system';

import { Database } from '../database';
import { DatabaseDriver } from '../database';

// Preloaded local metadata files
import { MetadataSchemas } from '../classes/metadata';
import { MetadataColumns } from '../classes/metadata';

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

    constructor(private readonly system: System) {
        // Insert all the defined metadata
        _.forEach(MetadataSchemas, (source, source_name) => this.intakeSchema(source_name, source));
        _.forEach(MetadataColumns, (source, source_name) => this.intakeColumn(source_name, source));

        // console.debug('SystemMeta.describe()', this.describe());
        // console.debug('SystemMeta.toColumnsOf("schema")', this.toColumnsOf('schema'));
        // console.debug('SystemMeta.toColumnsOf("column")', this.toColumnsOf('column'));
        // console.debug('SystemMeta.toColumnsOf("record")', this.toColumnsOf('record'));
    }

    async startup() {
        // // Create tables
        // let schema_sql = fs.readFileSync('/Users/ianzepp/Projects/MGC/minted-api/src/database/create-table-schema.sql').toString();
        // let column_sql = fs.readFileSync('/Users/ianzepp/Projects/MGC/minted-api/src/database/create-table-column.sql').toString();

        // console.warn('sql', schema_sql);

        // this.system.database.one(schema_sql);
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
        return this._schema_dict[schema_name];
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

    /**
     * Intakes a new schema into the system meta.
     * @param source_name - The name of the source schema.
     * @param source - The source schema to intake.
     */
    private intakeSchema(source_name: string, source: SchemaJson): void {
        chai.expect(source_name).string;
        chai.expect(source_name).not.includes('.');
        chai.expect(source).property('name').eq(source_name);

        // Check the target doesn't already exist
        chai.expect(this._schema_dict).not.has.key(source_name);

        // Create new instance and add to the dict
        this._schema_dict[source_name] = new Schema(source);

        // console.debug("SystemMeta: intakeSchema():", source_name);
    }

    /**
     * Intakes a new column into the system meta.
     * @param source_name - The name of the source column.
     * @param source - The source column to intake.
     */
    private intakeColumn(source_name: string, source: ColumnJson): void {
        chai.expect(source_name).string;
        chai.expect(source_name).includes('.');
        chai.expect(source).property('name').eq(source_name);

        // Check the target doesn't already exist
        chai.expect(this._column_dict).not.has.key(source_name);

        // Create new instance and add to the dict
        this._column_dict[source_name] = new Column(source);

        // console.debug("SystemMeta: intakeColumn():", source_name);
    }
}