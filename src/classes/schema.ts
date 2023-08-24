import _ from 'lodash';
import chai from 'chai';

// Classes
import { Filter } from '../classes/filter';
import { FilterJson } from '../classes/filter';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';

export type SchemaName = string;

export interface SchemaJson {
    name: string;
    description: string;
}

export class Schema implements SchemaJson {
    readonly name: string; 
    readonly description: string;

    constructor(source: SchemaJson) {
        chai.expect(source).property('name').not.contains('.');
        chai.expect(source).property('description');

        // Set properties
        this.name = source.name;
        this.description = source.description;
    }

    toFilter(filter_data: FilterJson) {
        return new Filter(this, filter_data);
    }

    toRecord(record_data: RecordJson) {
        return new Record(this, record_data);
    }

    toRecordSet(record_list: RecordJson[]) {
        return record_list.map(record_data => new Record(this, record_data));
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description
        };
    }
}