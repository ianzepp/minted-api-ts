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
    Custom = 'custom',
    Record = 'record',
    Filter = 'filter',
}

export type SchemaName = SchemaType | string;

export class Schema {
    // Re-export aliases
    public static Type = SchemaType;

    private readonly __columns_map: _.Dictionary<Column> = {};

    private readonly __caching = {};

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

    get columns_map(): _.Dictionary<Column> {
        return this.__columns_map;
    }

    get columns(): Column[] {
        return _.values(this.__columns_map);
    }

    //
    // Method
    //

    toFullName(): string {
        return this.schema_name;
    }

    toJSON(): Partial<RecordJson> {
        return toJSON(_.omit(this.source, ['info', 'acls']));
    }
}