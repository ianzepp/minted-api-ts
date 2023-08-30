import _ from 'lodash';
import chai from 'chai';

// Classes
import { RecordJson } from '../classes/record';
import { Schema } from '../classes/schema';

// Helpers
import assertReturn from '../helpers/assertReturn';
import toJSON from '../helpers/toJSON';

export class Column {
    private _schema: Schema;

    constructor(private readonly source: Partial<RecordJson>) {
        chai.expect(source).property('type').eq('column');
        chai.expect(source).property('data');
        chai.expect(source).nested.property('data.schema_name').a('string');
        chai.expect(source).nested.property('data.column_name').a('string');
        chai.expect(source).nested.property('data.description');
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

    get description(): string | null {
        return this.source.data.description;
    }

    get type(): string {
        return this.source.data.type || 'text';
    }

    get required(): boolean {
        return !!this.source.data.required;
    }

    get indexed(): boolean {
        return !!this.source.data.indexed;
    }

    get searchable(): boolean {
        return !!this.source.data.searchable;
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