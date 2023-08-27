import _ from 'lodash';
import chai from 'chai';

// Classes
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';

export class Column {
    constructor(readonly source: RecordJson) {
        chai.expect(source.data).property('name').contains('.');
        chai.expect(source.data).property('description');
    }

    get schema_name() {
        return _.head(this.source.data.name.split('.'));
    }

    get column_name() {
        return _.last(this.source.data.name.split('.'));
    }
    
    toJSON() {
        return this.source.data;
    }
}