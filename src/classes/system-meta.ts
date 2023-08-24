import _ from 'lodash';
import chai from 'chai';
import path from 'path';

// API
import { ChangeData } from '../types/record';
import { FilterInfo } from '../types/filter';
import { FilterJson } from '../types/filter';
import { RecordInfo } from '../types/record';
import { SchemaInfo } from '../types/schema';
import { ColumnInfo } from '../types/column';
import { SchemaName } from '../types/schema';
import { SchemaType } from '../types/schema';

// Classes
import { Schema } from '../classes/schema';
import { Column } from '../classes/column';
import { System } from '../classes/system';
import { Record } from '../classes/record';
import { Filter } from '../classes/filter';

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
    private readonly _schema_dict: _.Dictionary<SchemaInfo> = {};
    private readonly _column_dict: _.Dictionary<ColumnInfo> = {};

    constructor(private readonly system: System) {
        // Insert all the defined metadata
        _.forEach(MetadataSchemas, (source, source_name) => this.intakeSchema(source_name, source));
        _.forEach(MetadataColumns, (source, source_name) => this.intakeColumn(source_name, source));

        // console.debug('SystemMeta.describe()', this.describe());
        // console.debug('SystemMeta.toColumnsOf("schema")', this.toColumnsOf('schema'));
        // console.debug('SystemMeta.toColumnsOf("column")', this.toColumnsOf('column'));
        // console.debug('SystemMeta.toColumnsOf("record")', this.toColumnsOf('record'));
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
    toSchema(schema_name: string): SchemaInfo {
        return this._schema_dict[schema_name];
    }

    /**
     * Retrieves the column associated with the given column name.
     * @param column_name - The name of the column to retrieve.
     * @returns The column associated with the given name.
     */
    toColumn(column_name: string): ColumnInfo {
        return this._column_dict[column_name];
    }

    /**
     * Retrieves all columns associated with the given schema name.
     * @param schema_name - The name of the schema to retrieve columns for.
     * @returns An array of columns associated with the given schema name.
     */
    toColumnsOf(schema_name: string): ColumnInfo[] {
        let search = schema_name + '.';

        return _.transform(this._column_dict, (result, v, k) => {
            if (k.startsWith(search)) {
                result.push(v);
            }
        }, [] as ColumnInfo[]);
    }

    /**
     * Creates a new filter for the given schema name and filter data.
     * @param schema_name - The name of the schema to create a filter for.
     * @param filter_data - The filter data to use when creating the filter.
     * @returns The newly created filter.
     */
    toFilter(schema_name: string, filter_data?: FilterJson): FilterInfo {
        return new Filter(this.toSchema(schema_name), filter_data);
    }

    /**
     * Creates a new record for the given schema name and record data.
     * @param schema_name - The name of the schema to create a record for.
     * @param record_data - The record data to use when creating the record.
     * @returns The newly created record.
     */
    toRecord(schema_name: string, record_data?: ChangeData): RecordInfo {
        return new Record(this.toSchema(schema_name), record_data);
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
    private intakeSchema(source_name: string, source: SchemaInfo): void {
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
    private intakeColumn(source_name: string, source: ColumnInfo): void {
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