import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { Action } from '@classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';
import { Object } from '@classes/object';

// Typedefs
import { ActionRing } from '@typedefs/action';
import { ObjectType } from '@typedefs/object';

export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return ObjectType.Object;
    }

    onRing(): ActionRing {
        return ActionRing.Post;
    }

    onCreate(): boolean {
        return true;
    }

    isSeries(): boolean {
        return true;
    }

    async one(signal: Signal, record: Record) {
        // Sanity
        record.expect('name').a('string');
        record.expect('name').not.contains('.');
        record.expect('ns').a('string');

        // Create the object
        let object = Object.from(record.data);

        // Create the empty table with no default columns
        await signal.kernel.knex.createTable(object.system_name, t => {});

        // Add the object data to kernel meta
        signal.kernel.meta.addObject(record.data);
    }
}
