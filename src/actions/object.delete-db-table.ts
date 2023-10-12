import _ from 'lodash';

// Classes
import { AutoInstall } from '@classes/autoinstall';
import { Action } from '@classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

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

    onDelete(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        await Promise.all(signal.change.map(record => this.one(signal, record)));
    }

    async one(signal: Signal, record: Record) {
        // Sanity
        record.expect('name').a('string');
        record.expect('name').not.contains('.');

        // Setup
        let object_name = record.data.name;
        let object = signal.kernel.meta.objects.get(object_name);

        // Delete related columns
        await signal.kernel.data.deleteAny(ObjectType.Column, {
            where: {
                name: `${ object_name }.%`
            }
        });

        // Create the empty table with no default columns
        await signal.kernel.data.deleteTable(object_name);

        // Remove from kernel metadata
        signal.kernel.meta.objects.delete(object_name);
    }
}
