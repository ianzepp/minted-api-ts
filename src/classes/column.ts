import _ from 'lodash';
import chai from 'chai';

// Classes
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';

export class Column {
    readonly schema_name: string;
    readonly column_name: string;
    readonly description: string;

    constructor(source: RecordJson) {
        this.schema_name = source.data.schema_name;
        this.column_name = source.data.column_name;
        this.description = source.data.description;

    }

    toJSON(): Partial<RecordJson> {
        return {
            type: 'column',
            data: {
                schema_name: this.schema_name,
                column_name: this.column_name,
                description: this.description
            }
        }
    }
}