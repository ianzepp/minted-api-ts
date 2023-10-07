import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';
import { Object } from '@classes/object';

// Typedefs
import { ActionRing } from '@root/src/typedefs/action';
import { ObjectType } from '@typedefs/object';

// Knex functions
import { createTable } from '@classes/knex';

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

    async run(signal: Signal): Promise<void> {
        await Promise.all(signal.change.map(record => this.one(signal, record)));
    }

    async one(signal: Signal, record: Record) {
        // Setup
        let object_name = record.data.name;

        // Create the empty table with no default columns
        await createTable(signal.kernel.data.driver, object_name, t => {});

        // Add to kernel metadata
        signal.kernel.meta.objects.set(object_name, Object.from(record.data));
    }
}
