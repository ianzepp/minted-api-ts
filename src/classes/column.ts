import _ from 'lodash';

export class Column {
    public readonly id: string;
    public readonly ns: string;

    public readonly name: string;
    public readonly type: string;
    
    public readonly audited: boolean;
    public readonly immutable: boolean;
    public readonly indexed: boolean;
    public readonly internal: boolean;
    public readonly required: boolean;
    public readonly unique: boolean;

    public readonly minimum: number | null;
    public readonly maximum: number | null;

    constructor(flat: _.Dictionary<any>) {
        this.id = flat.id;
        this.ns = flat.ns;

        this.name = flat.name;
        this.type = flat.type;

        this.audited = flat.audited;
        this.immutable = flat.immutable;
        this.indexed = flat.indexed;
        this.internal = flat.internal;
        this.required = flat.required;
        this.unique = flat.unique;

        this.minimum = flat.minimum;
        this.maximum = flat.maximum;
    }

    /**
     * Returns only the `schema_name` portion of the full name property. For example, if the column's name
     * property is set to `system.domain:name`, then `schema_name` returns `system.domain`.
     */
    get schema_name() {
        return _.head(this.name.split(':'));
    }

    /**
     * Returns only the `column_name` portion of the full name property. For example, if the column's name
     * property is set to `system.domain:name`, then `column_name` returns `name`.
     */
    get column_name() {
        return _.last(this.name.split(':'));
    }

    /**
     * Returns the two path parts of the column name. For example, if the column is `system.domain:name`,
     * then the `path()` function will return an array `[undefined, 'name']`. If the column is in namespace
     * itself, such as `package.myobj:customer.field`, then `path()` will return `['customer', 'field']`.
     * @returns An array with two parts
     */
    path() {
        return this.name.includes('.') ? this.name.split('.') : [undefined, this.name];
    }

}
