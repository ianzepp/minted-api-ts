import _ from 'lodash';
import chai from 'chai';

export class Column {
    // Properties
    public readonly system_name: string;
    public readonly object_name: string;
    public readonly column_name: string;

    constructor(public readonly data: _.Dictionary<any>) {
        chai.expect(data).property('ns').string;
        chai.expect(data).property('name').string;
        chai.expect(data).property('name').matches(/^[a-zA-Z][a-zA-Z0-9_]*$/i);
        chai.expect(data).property('object').string;
        chai.expect(data).property('object').includes('::');

        // Store local properties
        this.system_name = `${ data.ns }::${ data.name }`.toLowerCase();
        this.object_name = `${ data.object }`.toLowerCase();
        this.column_name = `${ data.name }`.toLowerCase();
    }

    toJSON() {
        return {
            type: 'system::column',
            data: this.data
        };
    }
}
