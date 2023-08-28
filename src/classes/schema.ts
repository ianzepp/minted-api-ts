import _ from 'lodash';
import chai from 'chai';

// Classes
import { Filter } from '../classes/filter';
import { FilterJson } from '../classes/filter';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';

export type SchemaName = string;

export class Schema {
    readonly name: string;
    readonly description: string;

    constructor(source: RecordJson) {
        this.name = source.data.schema_name;
        this.description = source.data.description;
    }

    toFilter(filter_data: FilterJson) {
        return new Filter(this, filter_data);
    }

    toRecord(record_data: Partial<RecordJson>) {
        return new Record(this, record_data);
    }

    toRecordSet(record_list: Partial<RecordJson>[]) {
        return record_list.map(record_data => new Record(this, record_data));
    }

    toJSON(): Partial<RecordJson> {
        return {
            type: 'schema',
            data: {
                name: this.name,
                description: this.description
            }
        }
    }
}