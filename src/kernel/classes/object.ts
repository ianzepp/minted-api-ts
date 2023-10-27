import _ from 'lodash';
import chai, { assert } from 'chai';

// Classes
import { Column } from '@kernel/classes/column';

export class Object {
    public readonly system_name: string;
    public readonly object_name: string;
    public readonly columns: _.Dictionary<Column> = {};

    constructor(public readonly data: _.Dictionary<any>) {
        chai.expect(data).property('ns').string;
        chai.expect(data).property('rn').string;
        chai.expect(data).property('rn').matches(/^[a-zA-Z][a-zA-Z0-9_]*$/i);

        this.object_name = `${ data.rn }`.toLowerCase();
        this.system_name = `${ data.ns }::${ data.rn }`.toLowerCase();
    }

    //
    // Getters/Setters
    //

    get column_keys() {
        return _.keys(this.columns);
    }

    column(column_name: string): Column | undefined {
        return this.columns[column_name];
    }

    inherits(object_name: string) {
        return this.system_name === object_name || object_name === '*' || object_name === 'system::record';
    }

    toJSON() {
        return {
            type: 'system::object',
            data: this.data
        };
    }
}