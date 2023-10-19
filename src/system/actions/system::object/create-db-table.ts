import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';
import { Record } from '@system/classes/record';
import { Object } from '@system/classes/object';

// Typedefs
import { ActionRing } from '@system/typedefs/action';
import { ObjectType } from '@system/typedefs/object';

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

    async one({ kernel }: Signal, record: Record) {
        // Sanity
        record.expect('name').a('string');
        record.expect('name').not.contains('.');
        record.expect('ns').a('string');

        // Create the object
        let object = Object.from(record.data);

        // Create the empty table with no default columns
        await kernel.knex.createTable(object.system_name, t => {});

        // Add the object data to kernel meta
        kernel.meta.addObject(record.data);
    }
}
