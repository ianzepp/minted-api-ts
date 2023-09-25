import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '@classes/column';
import { Record } from '@classes/record';
import { toJSON } from '@classes/helpers';

// Typedefs
import { ColumnsMeta } from '@typedefs/column';
import { ColumnName } from '@typedefs/column';
import { ColumnForm } from '@typedefs/column';
import { ColumnType } from '@typedefs/column';
import { SchemaName } from '@typedefs/schema';
import { SchemaType } from '@typedefs/schema';


/**
 * The `Schema` class represents a schema in the database.
 * It provides methods to:
 * - Generate a new `Schema` instance from provided flat data.
 * - Access properties of the schema such as `id`, `ns` (namespace), `name`, `type`, and `metadata`.
 * - Get the names, types, and forms of the columns in the schema.
 * - Check if the schema name matches a provided name.
 * - Check if the schema has a column with a specified name.
 * - Retrieve a column from the schema by its name.
 * - Generate an array of keys from the schema's column names, with an optional prefix.
 * - Insert a column into the schema.
 * - Remove a column from the schema.
 * - Get the two path parts of the schema name.
 * - Convert the schema to a record.
 */
export class Schema {
    //
    // Static
    //

    // Re-export aliases
    public static Type = SchemaType;


    /**
     * Generates a new `Schema` instance from provided flat data.
     * 
     * @param {_.Dictionary<any>} flat - The flat data to generate the schema from.
     * @returns {Schema} Returns a new `Schema` instance.
     */
    static from(flat: _.Dictionary<any>): Schema {
        return new Schema(
            flat.id,
            flat.ns,
            flat.name,
            flat.type,
            flat.metadata,
        );
    }

    // Properties
    public columns: _.Dictionary<Column> = {};

    constructor(
        public readonly id: string,
        public readonly ns: string,
        public readonly name: SchemaName,
        public readonly type: string,
        public readonly metadata: boolean) {}

    //
    // Getters/Setters
    //

    /**
     * Retrieves the names of all columns in the schema.
     * 
     * @returns {ColumnName[]} Returns an array of column names.
     */
    get names(): ColumnName[] {
        return _.keys(this.columns);
    }

    /**
     * Retrieves the types of all columns in the schema.
     * 
     * @returns {ColumnType[]} Returns an array of column types.
     */
    get types(): ColumnType[] {
        return _.map(_.values(this.columns), column => column.type);
    }

    /**
     * Retrieves the forms of all columns in the schema.
     * 
     * @returns {ColumnForm[][]} Returns a 2D array of column forms.
     */
    get forms(): ColumnForm[][] {
        return _.map(_.values(this.columns), column => column.forms);
    }

    //
    // Methods
    //

    /**
     * Checks if the schema name matches the provided name.
     * 
     * @param {SchemaName} name - The name to check against the schema name.
     * @returns {boolean} Returns true if the provided name matches the schema name, false otherwise.
     */
    is(name: SchemaName) {
        return this.name === name;
    }

    /**
     * Checks if the schema has a column with the specified name.
     * 
     * @param {ColumnName} name - The name of the column to check for.
     * @returns {boolean} Returns true if a column with the specified name exists, false otherwise.
     */
    has(name: ColumnName): boolean {
        return _.has(this.columns, name);
    }

    /**
     * Retrieves a column from the schema by its name.
     * 
     * @param {ColumnName} name - The name of the column to retrieve.
     * @returns {Column | undefined} Returns the column if found, undefined otherwise.
     */
    get(name: ColumnName): Column | undefined {
        return _.get(this.columns, name);
    }

    /**
     * Generates an array of keys from the schema's column names. If a prefix is provided, it is prepended to each key.
     * 
     * @param {string} prefix - The prefix to prepend to each key.
     * @returns {string[]} Returns an array of keys.
     */
    keys(prefix?: string): string[] {
        return _.map(this.names, name => prefix ? prefix + '.' + name : name);
    }

    /**
     * Inserts a column into the schema.
     * 
     * @param {Column} column - The column to be inserted.
     * @returns {this} Returns the current schema instance.
     */
    insert(column: Column): this {
        this.columns[column.column_name] = column;
        return this;
    }

    /**
     * Removes a column from the schema.
     * 
     * @param {Column | ColumnName} column - The column to be removed.
     * @returns {this} Returns the current schema instance.
     */
    remove(column: Column | ColumnName): this {
        _.unset(this.columns, column instanceof Column ? column.column_name : column);
        return this;
    }

    /**
     * Splits the schema name into its constituent parts and returns them as an array. For example, if the schema's full name is `system:domain`, 
     * calling the `path()` function will return an array `['system', 'domain']`.
     * @returns {string[]} An array containing the parts of the schema name.
     */
    path() {
        return this.name.split(':');
    }

    /**
     * Converts the schema to a record.
     * 
     * @param {any} source - The source from which to create the record.
     * @returns {Record} Returns a new Record instance.
     * @throws {Error} Throws an error if the source is unsupported.
     */
    toRecord(source?: any) {
        let record = new Record(this);

        if (source === undefined) {
            // do nothing
        }

        else if (source instanceof Record) {
            _.assign(record.data, source.data);
            _.assign(record.prev, source.prev);
            _.assign(record.meta, source.meta);
        }

        else if (Schema.isRecordJson(source)) {
            _.assign(record.data, source.data);
            _.assign(record.meta, source.meta);
        }

        else if (Schema.isRecordFlat(source)) {
            _.assign(record.data, _.omit(source, ColumnsMeta));
            _.assign(record.meta, _.pick(source, ColumnsMeta));
        }

        else if (Schema.isRecordDict(source)) {
            _.assign(record.data, _.omit(source, ColumnsMeta));
        }

        else {
            throw new Error('Unsupported "Record" source: ' + toJSON(source));
        }

        return record;
    }

    /**
     * Checks if the source is a record dictionary.
     * 
     * @param {unknown} source - The source to check.
     * @returns {boolean} Returns true if the source is a record dictionary, false otherwise.
     */
    private static isRecordDict(source: unknown) {
        return typeof source === 'object'; 
    }

    /**
     * Checks if the source is a record JSON.
     * 
     * @param {unknown} source - The source to check.
     * @returns {boolean} Returns true if the source is a record JSON, false otherwise.
     */
    private static isRecordJson(source: unknown) {
        return typeof source === 'object'
            && _.has(source, 'data')
            && _.has(source, 'meta');
    }

    /**
     * Checks if the source is a record flat.
     * 
     * @param {unknown} source - The source to check.
     * @returns {boolean} Returns true if the source is a record flat, false otherwise.
     */
    private static isRecordFlat(source: unknown) {
        return typeof source === 'object'
            && _.has(source, 'id')
            && _.has(source, 'ns')
            && _.has(source, 'created_at')
            && _.has(source, 'updated_at')
            && _.has(source, 'expired_at')
            && _.has(source, 'acls_full')
            && _.has(source, 'acls_edit')
            && _.has(source, 'acls_read')
            && _.has(source, 'acls_deny');
    }
}
