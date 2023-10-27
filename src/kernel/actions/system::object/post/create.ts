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
        record.expect('ns').a('string');
        record.expect('rn').a('string');
        record.expect('rn').match(/^[a-z_0-9]+$/i);
        record.expect('rn').not.match(/^[_0-9]/i);

        // Create the object
        let object = new Object(record.data);

        // Create the empty table with no default columns
        await kernel.knex.createTable(object.system_name, t => {});

        // Add the object data to kernel meta
        kernel.meta.registerObject(record.data);
    }
}
