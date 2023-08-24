import _ from 'lodash';
import chai from 'chai';

// API
import { ColumnInfo } from '../types/column';
import { ColumnName } from '../types/column';

// Classes
export class Column implements ColumnInfo {
    readonly name: string;
    readonly description: string;

    constructor(source: ColumnInfo) {
        chai.expect(source).property('name').contains('.');
        chai.expect(source).property('description');

        // Instantiate
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