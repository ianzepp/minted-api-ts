import _ from 'lodash';

// Classes
import { DataError } from '@classes/kernel-data';
import { Neuron } from '@classes/neuron';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { NeuronRing } from '@typedefs/neuron';
import { SchemaType } from '@typedefs/schema';

/**
 * This observer listens to inserts on the `system.domain` table (which represents an organization or namespace),
 * and generates an associated `User` record with admin permissions.
 */
export default class extends Neuron {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return SchemaType.Domain;
    }

    onRing(): NeuronRing {
        return NeuronRing.Flow;
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
        await signal.kernel.data.createAll(SchemaType.User, users);
    }
}
