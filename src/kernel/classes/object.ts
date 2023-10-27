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
        chai.expect(data).property('name').string;
        chai.expect(data).property('name').matches(/^[a-zA-Z][a-zA-Z0-9_]*$/i);

        this.object_name = `${ data.name }`.toLowerCase();
        this.system_name = `${ data.ns }::${ data.name }`.toLowerCase();

        // Common columns
        // this.columns['id'] = new Column({ ns: data.ns, name: 'id', type: 'uuid', required: true, immutable: true });
        // this.columns['ns'] = new Column({ ns: data.ns, name: 'ns', type: 'text', required: true, immutable: true });
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