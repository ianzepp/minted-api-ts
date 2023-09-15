import _ from 'lodash';

export class Column {
    public readonly id: string;
    public readonly ns: string;

    public readonly schema_name: string;
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

        this.schema_name = flat.schema_name;
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

    // Bonus

    get column_path(): string {
        return this.schema_name + ':' + this.name;
    }
}
