import _ from 'lodash';
import chai from 'chai';

// API
import { ChangeData } from '../types/record';
import { FilterJson } from '../types/filter';
import { FilterInfo } from '../types/filter';
import { RecordInfo } from '../types/record';
import { SchemaInfo } from '../types/schema';
import { ColumnInfo } from '../types/column';
import { SchemaName } from '../types/schema';

// Classes
import { Column } from '../classes/column';

export class Schema implements SchemaInfo {
    readonly name: string;
    readonly description: string;

    constructor(source: SchemaInfo) {
        chai.expect(source).property('name').not.contains('.');
        chai.expect(source).property('description');

        // Set properties
        this.name = source.name;
        this.description = source.description;
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description
        };
    }
}