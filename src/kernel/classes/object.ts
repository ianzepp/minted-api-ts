import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '@kernel/classes/column';
import { ColumnsMeta } from '@kernel/classes/column';
import { ColumnsAcls } from '@kernel/classes/column';

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
    // Helpers
    public static ColumnsMeta = ColumnsMeta;
    public static ColumnsAcls = ColumnsAcls;

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

    column(column_name: string): Column | undefined {
        return this.columns[column_name];
    }

    inherits(object_name: string) {
        return this.system_name === object_name || object_name === '*' || object_name === 'system::record';
    }

    toJSON() {
        return {
            type: 'system::object',
            data: this.data
        };
    }
}