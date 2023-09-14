import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { Record } from '@classes/record';

// Layouts
import { ObserverRing } from '@layouts/observer';
import { DataError } from '@classes/kernel-data';
import { SchemaType } from '@classes/schema-type';

/**
 * This observer lstens to inserts on the `system.domain` table (which represents an organization or namespace),
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
        let clients = flow.change.map(record => {
            return { ns: record.data.ns, name: 'admin' };
        });

        // Insert the clients
        await flow.kernel.data.createAll(SchemaType.User, clients);
    }
}
