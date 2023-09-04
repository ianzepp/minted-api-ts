import _ from 'lodash';
import chai from 'chai';

// Classes
import { RecordJson } from '../classes/record';
import { Schema } from '../classes/schema';

// Helpers
import assertReturn from '../helpers/assertReturn';
import toJSON from '../helpers/toJSON';

export enum ColumnType {
    Boolean = 'boolean',
    Decimal = 'decimal',
    Enum = 'enum',
    Integer = 'integer',
    Json = 'json',
    Number = 'number',
    Text = 'text',
}

export class Column {
    // Re-export aliases
    public static Type = ColumnType;

    private _schema: Schema;

    constructor(private readonly source: Partial<RecordJson>) {
        chai.expect(source).property('type').eq('column');
        chai.expect(source).property('data');
        chai.expect(source).nested.property('data.schema_name').a('string');
        chai.expect(source).nested.property('data.column_name').a('string');
    }

    //
    // Properties from database
    //

    get schema_name(): string {
        return this.source.data.schema_name;
    }

    get column_name(): string {
        return this.source.data.column_name;
    }

    get intern_name(): string {
        return this.source.data.intern_name ?? this.column_name;
    }

    get description(): string | null {
        return this.source.data.description ?? null;
    }

    get type(): ColumnType {
        return this.source.data.type ?? Column.Type.Text;
    }

    get required(): boolean {
        return this.source.data.required ?? false;
    }

    get indexed(): boolean {
        return this.source.data.indexed ?? false;
    }

    get searchable(): boolean {
        return this.source.data.searchable ?? false;
    }

    get precision(): number | null {
        return this.source.data.precision ?? null;
    }

    get min(): number {
        return this.source.data.min ?? 0;
    }

    get max(): number {
        return this.source.data.max ?? Number.MAX_SAFE_INTEGER;
    }

    get enums(): string[] {
        return this.source.data.min ?? [];
    }

    //
    // Helper properties
    //

    get schema() {
        return assertReturn(this._schema);
    }

    set schema(schema: Schema) {
        this._schema = schema;
    }

    //
    // Methods
    //

    toFullName() {
        return this.schema_name + '.' + this.column_name;
    }

    toJSON(): Partial<RecordJson> {
        return toJSON(_.omit(this.source, ['info', 'acls']));
    }



}