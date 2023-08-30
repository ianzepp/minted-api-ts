import _ from 'lodash';
import chai from 'chai';

// Classes
import { Filter } from '../classes/filter';
import { FilterJson } from '../classes/filter';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';

// Helpers
import toJSON from '../helpers/toJSON';

export type SchemaName = string;

export class Schema {
    constructor(private readonly source: Partial<RecordJson>) {
        chai.expect(source).property('type').eq('schema');
        chai.expect(source).property('data');
        chai.expect(source).nested.property('data.schema_name').a('string');
        chai.expect(source).nested.property('data.description');
    }

    get schema_name() {
        return this.source.data.schema_name;
    }

    get description() {
        return this.source.data.description;
    }

    toJSON(): Partial<RecordJson> {
        return toJSON(_.omit(this.source, ['info', 'acls']));
    }
}