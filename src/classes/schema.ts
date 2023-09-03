import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '../classes/column';
import { Filter } from '../classes/filter';
import { FilterJson } from '../classes/filter';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';

// Helpers
import toJSON from '../helpers/toJSON';

export enum SchemaType {
    Schema = 'schema',
    Column = 'column',
    Record = 'record',
    Filter = 'filter',
};

export type SchemaName = SchemaType | string;

export class Schema {
    public static TypeSchema = 'schema';
    public static TypeColumn = 'column';
    public static TypeFilter = 'filter';
    public static TypeCustom = 'custom';

    private readonly _columns_map: _.Dictionary<Column> = {};

    private readonly _caching = {

    }

    constructor(private readonly source: Partial<RecordJson>) {
        chai.expect(source).property('type').eq('schema');
        chai.expect(source).property('data');
        chai.expect(source).nested.property('data.schema_name').a('string');
        chai.expect(source).nested.property('data.description');
    }

    get schema_name(): string {
        return this.source.data.schema_name;
    }

    get intern_name(): string {
        return this.source.data.intern_name ?? this.schema_name;
    }

    get description(): string | null {
        return this.source.data.description ?? null;
    }

    //
    // Helpers
    //

    get columns_map() {
        return this._columns_map;
    }

    get columns() {
        return _.values(this._columns_map);
    }

    //
    // Method
    //

    toFullName() {
        return this.schema_name;
    }

    toJSON(): Partial<RecordJson> {
        return toJSON(_.omit(this.source, ['info', 'acls']));
    }
}