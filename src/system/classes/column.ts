import _ from 'lodash';

// Typedefs
import { ColumnName } from '@system/typedefs/column';
import { ColumnForm } from '@system/typedefs/column';
import { ColumnType } from '@system/typedefs/column';


/**
 * The `Column` class represents a column in a database table.
 * It provides functionalities to:
 * - Generate a new `Column` instance from provided flat data.
 * - Access properties of the column such as `id`, `ns` (namespace), `name`, `type`, `forms`, `minimum` and `maximum`.
 * - Get the `object_name` and `column_name` from the full name of the column.
 * - Check if the column is of a specific type or has a specific form.
 * - Get the two path parts of the column name.
 */
export class Column {
    //
    // Static
    //

    // Re-export aliases
    public static Form = ColumnForm;
    public static Type = ColumnType;


    /**
     * Generates a new `Column` instance from provided flat data.
     * 
     * @param {_.Dictionary<any>} flat - The flat data to generate the column from.
     * @returns {Column} Returns a new `Column` instance.
     */
    public static from(flat: _.Dictionary<any>): Column {
        let forms: ColumnForm[] = _.filter(ColumnForm, form => !!_.get(flat, form, false));
        
        return new Column(
            flat.id,
            flat.ns,
            flat.name,
            flat.type,
            forms,
            flat.minimum,
            flat.maximum,
        );
    }

    private constructor(
        public readonly id: string,
        public readonly ns: string,
        public readonly name: ColumnName,
        public readonly type: ColumnType,
        public readonly forms: ColumnForm[],
        public readonly minimum: number | null,
        public readonly maximum: number | null) {}

    //
    // Getters/Setters
    //

    /**
     * Returns only the `object_name` portion of the full name property. For example, if the column's name
     * property is set to `system::domain.name`, then `object_name` returns `system::domain`.
     */
    get object_name() {
        let object_name = _.head(this.name.split('.')) || '';

        if (object_name.includes('::') === false) {
            object_name = this.ns + '::' + object_name;
        }

        return object_name;
    }

    /**
     * Returns only the `column_name` portion of the full name property. For example, if the column's name
     * property is set to `system::domain.name`, then `column_name` returns `name`.
     */
    get column_name() {
        return _.last(this.name.split('.'));
    }

    get system_name() {
        return this.column_name; // TODO add a namespace
    }

    //
    // Methods
    //

    /**
     * Checks if the column is of a specific type.
     * 
     * @param {ColumnType} type - The type to check against.
     * @returns {boolean} Returns true if the column is of the specified type, false otherwise.
     */
    is(type: ColumnType): boolean {
        return this.type === type;
    }

    /**
     * Checks if the column has a specific form.
     * 
     * @param {ColumnForm | string} form - The form to check for.
     * @returns {boolean} Returns true if the column has the specified form, false otherwise.
     */
    of(form: ColumnForm | string): boolean {
        if (form === Column.Form.Required && this.column_name === 'name') {
            return true;
        }

        if (form === Column.Form.Immutable && this.column_name === 'id') {
            return true;
        }

        if (form === Column.Form.Immutable && this.column_name === 'ns') {
            return true;
        }

        return _.includes(this.forms, form);
    }
}
