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


    get schema_name() {
        return _.head(this.name.split('.'));
    }

    get column_name() {
        return _.last(this.name.split('.'));
    }
    
    toJSON() {
        return {
            name: this.name,
            description: this.description
        };
    }
}