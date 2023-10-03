import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { AutoInstall } from '@classes/autoinstall';
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';
import { Object } from '@classes/object';

// Typedefs
import { ActionRing } from '@typedefs/neuron';
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

    async run(signal: Signal): Promise<void> {
        await Promise.all(signal.change.map(record => this.one(signal, record)));
    }

    async one(signal: Signal, record: Record) {
        // Setup
        let object_name = record.data.name;
        let object_type = record.data.type;
        let auto = new AutoInstall(signal.kernel);

        // Only create objects that are marked as `database` types
        if (object_type !== 'database') {
            return;
        }

        // Create the empty table with no default columns
        await auto.createTable(object_name, table => {});

        // Add to kernel metadata
        signal.kernel.meta.objects.set(object_name, Object.from(record.data));
    }
}
