import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { Action } from '@kernel/classes/action';
import { Signal } from '@kernel/classes/signal';
import { Record } from '@kernel/classes/record';
import { Object } from '@kernel/classes/object';

export default class extends Action {
    constructor() {
        super(__filename, { series: true });
    }

    async one({ kernel }: Signal, record: Record) {
        // Sanity
        record.expect('name').a('string');
        record.expect('name').match(/^[a-z_0-9]+$/i);
        record.expect('name').not.match(/^[_0-9]/i);
        record.expect('ns').a('string');

        // Create the object
        let object = Object.from(record.data);

        // Create the empty table with no default columns
        await kernel.knex.createTable(object.system_name, t => {});

        console.warn('adding object:', record.data);
        
        // Add the object data to kernel meta
        kernel.meta.addObject(record.data);
    }
}
