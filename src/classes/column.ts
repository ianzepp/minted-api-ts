import _ from 'lodash';
import chai from 'chai';

export interface ColumnJson {
    name: string;
    description: string;
}

export class Column implements ColumnJson {
    readonly name: string;
    readonly description: string;

    constructor(source: ColumnJson) {
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