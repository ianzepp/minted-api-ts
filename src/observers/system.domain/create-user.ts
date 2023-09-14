import _ from 'lodash';

// Classes
import { DataError } from '@classes/kernel-data';
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { Record } from '@classes/record';

// Typedefs
import { ObserverRing } from '@typedefs/observer';
import { SchemaType } from '@typedefs/schema';

/**
 * This observer listens to inserts on the `system.domain` table (which represents an organization or namespace),
 * and generates an associated `User` record with admin permissions.
 */
export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return SchemaType.Domain;
    }

    onRing(): ObserverRing {
        return ObserverRing.Flow;
    }

    onCreate(): boolean {
        return true;
    }

    asRoot() {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        let users = flow.change.map(record => {
            return { ns: record.data.ns, name: 'admin' };
        });

        // Insert the users
        await flow.kernel.data.createAll(SchemaType.User, users);
    }
}
