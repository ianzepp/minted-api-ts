import _ from 'lodash';

// Classes
import { DataError } from '@classes/kernel-data';
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ActionRing } from '@typedefs/neuron';
import { ObjectType } from '@typedefs/object';

/**
 * This neuron listens to inserts on the `system.domain` table (which represents an organization or namespace),
 * and generates an associated `User` record with admin permissions.
 */
export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return ObjectType.Domain;
    }

    onRing(): ActionRing {
        return ActionRing.Flow;
    }

    onCreate(): boolean {
        return true;
    }

    asRoot() {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        let users = signal.change.map(record => {
            return { ns: record.data.ns, name: 'admin' };
        });

        // Insert the users
        await signal.kernel.data.createAll(ObjectType.User, users);
    }
}
