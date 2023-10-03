import _ from 'lodash';

// Classes
import { AutoInstall } from '@classes/autoinstall';
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

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

    onDelete(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        await Promise.all(signal.change.map(record => this.one(signal, record)));
    }

    async one(signal: Signal, record: Record) {
        let object_name = record.data.name;
        let object_type = record.data.type;
        let auto = new AutoInstall(signal.kernel);

        // Only delete objects that are marked as `database` types
        if (object_type !== 'database') {
            return;
        }

        // Drop the table
        await auto.deleteTable(object_name);

        // Remove from kernel metadata
        signal.kernel.meta.objects.delete(object_name);
    }
}
