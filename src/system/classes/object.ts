import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '@system/classes/column';
import { Record } from '@system/classes/record';
import { toJSON } from '@system/classes/helper';
import { toTypeCase } from '@system/classes/helper';

// Typedefs
import { ColumnsAcls, ColumnsMeta } from '@system/typedefs/column';
import { ColumnName } from '@system/typedefs/column';
import { ColumnForm } from '@system/typedefs/column';
import { ColumnType } from '@system/typedefs/column';
import { ObjectName } from '@system/typedefs/object';
import { ObjectType } from '@system/typedefs/object';

export interface ObjectData {
    name: string;
    description: string | null;
}

export interface ColumnData {
    name: string;
    description: string | null;
}

/**
 * The `Object` class represents a object in the database.
 * It provides methods to:
 * - Generate a new `Object` instance from provided flat data.
 * - Access properties of the object such as `id`, `ns` (namespace), `name`, `type`, and `metadata`.
 * - Get the names, types, and forms of the columns in the object.
 * - Check if the object name matches a provided name.
 * - Check if the object has a column with a specified name.
 * - Retrieve a column from the object by its name.
 * - Generate an array of keys from the object's column names, with an optional prefix.
 * - Insert a column into the object.
 * - Remove a column from the object.
 * - Get the two path parts of the object name.
 * - Convert the object to a record.
 */
export class Object {
    //
    // Static
    //

    // Re-export aliases
    public static Type = ObjectType;

    // Properties
    public readonly data: _.Dictionary<any> = {};
    public readonly columns: _.Dictionary<Column> = {};

    /**
     * Generates a new `Object` instance from provided flat data.
     * 
     * @param {_.Dictionary<any>} flat - The flat data to generate the object from.
     * @returns {Object} Returns a new `Object` instance.
     */
    public static from(flat: _.Dictionary<any>): Object {
        // Check inputs
        chai.expect(flat).property('name').string;
        chai.expect(flat).property('name').matches(/^[a-zA-Z][a-zA-Z0-9_]*$/i);

        // Generate the instance
        let object = new Object();

        // Extract only the valid properties
        flat = _.pick(flat, ['id', 'ns', 'name', 'description']);

        // Save to the internal data
        _.assign(object.data, flat);

        // Done
        return object;
    }

    // Private constructor
    private constructor() {}

    //
    // Getters/Setters
    //

    get system_name() {
        return this.data.ns + '::' + this.data.name;
    }

    get object_name() {
        return this.data.name;
    }

    get column_keys() {
        return _.keys(this.columns);
    }

    exists(column_name: string) {
        return this.columns[column_name] !== undefined;
    }

    add(column: Column) {
        _.set(this.columns, column.column_name, column);
    }

    /**
     * Retrieves the names of all columns in the object.
     * 
     * @returns {ColumnName[]} Returns an array of column names.
     */
    get names(): ColumnName[] {
        return _.keys(this.columns);
    }

    /**
     * Retrieves the types of all columns in the object.
     * 
     * @returns {ColumnType[]} Returns an array of column types.
     */
    get types(): ColumnType[] {
        return _.map(_.values(this.columns), column => column.type);
    }

    /**
     * Retrieves the forms of all columns in the object.
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
     * Checks if the object name matches the provided name.
     * 
     * @param {ObjectName} name - The name to check against the object name.
     * @returns {boolean} Returns true if the provided name matches the object name, false otherwise.
     */
    is(name: ObjectName) {
        return this.data.name === name;
    }

    inherits(object_name: string) {
        return this.system_name === object_name || object_name === '*' || object_name === 'system::record';
    }

    /**
     * Checks if the object has a column with the specified name.
     * 
     * @param {ColumnName} name - The name of the column to check for.
     * @returns {boolean} Returns true if a column with the specified name exists, false otherwise.
     */
    has(name: ColumnName): boolean {
        return _.has(this.columns, name);
    }

    /**
     * Retrieves a column from the object by its name.
     * 
     * @param {ColumnName} name - The name of the column to retrieve.
     * @returns {Column | undefined} Returns the column if found, undefined otherwise.
     */
    get(name: ColumnName): Column | undefined {
        return _.get(this.columns, name);
    }

    /**
     * Generates an array of keys from the object's column names. If a prefix is provided, it is prepended to each key.
     * 
     * @param {string} prefix - The prefix to prepend to each key.
     * @returns {string[]} Returns an array of keys.
     */
    keys(prefix?: string): string[] {
        return _.map(this.names, name => prefix ? prefix + '.' + name : name);
    }

    /**
     * Inserts a column into the object.
     * 
     * @param {Column} column - The column to be inserted.
     * @returns {this} Returns the current object instance.
     */
    insert(column: Column): this {
        this.columns[column.column_name] = column;
        return this;
    }

    /**
     * Removes a column from the object.
     * 
     * @param {Column | ColumnName} column - The column to be removed.
     * @returns {this} Returns the current object instance.
     */
    remove(column: Column | ColumnName): this {
        _.unset(this.columns, column instanceof Column ? column.column_name : column);
        return this;
    }

    /**
     * Converts the object to a record.
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
            _.assign(record.acls, source.acls);
        }

        else if (Object.isRecordJson(source)) {
            _.assign(record.data, source.data);
            _.assign(record.meta, source.meta);
            _.assign(record.acls, source.acls);
        }

        else if (Object.isRecordFlat(source)) {
            _.assign(record.data, _.omit(source, ColumnsMeta, ColumnsAcls));
            _.assign(record.meta, _.pick(source, ColumnsMeta));
            _.assign(record.acls, _.pick(source, ColumnsAcls));
        }

        else if (Object.isRecordDict(source)) {
            _.assign(record.data, _.omit(source, ColumnsMeta, ColumnsAcls));
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
            && _.has(source, 'type')
            && typeof _.get(source, 'type') === 'string'
            && _.has(source, 'data')
            && typeof _.get(source, 'data') === 'object';
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
            && typeof _.get(source, 'id') === 'string'
            && _.has(source, 'ns')
            && typeof _.get(source, 'ns') === 'string'
            && _.has(source, 'created_at')
            && _.has(source, 'updated_at')
            && _.has(source, 'expired_at')
            && _.has(source, 'access_full')
            && _.has(source, 'access_edit')
            && _.has(source, 'access_read')
            && _.has(source, 'access_deny');
    }

    //
    // Convert the object to a typedef representation
    //

    toTypedefs() {
        let column_text = _.map(this.columns, c => {
            return `  ${ c.column_name }: ${ c.type };\n`;
        });

        let object_text = [
            `// @description ${ this.data.description || '' }\n`,
            `// @ns ${ this.data.ns }\n`,
            `interface ${ toTypeCase(this.system_name) } {\n`,
            column_text.join(''),
            `}\n`
        ];

        return object_text.join('');
    }

    toGraphQL() {
        
    }
}
