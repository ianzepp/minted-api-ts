import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { Record } from '@classes/record';

// Layouts
import { ObserverRing } from '@layouts/observer';
import { DataError } from '@classes/system-data';
import { SchemaType } from '@classes/schema-type';

/**
 * This observer lstens to inserts on the `system.system` table (which represents an organization or namespace),
 * and generates an associated `Client` record with admin permissions.
 */
export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return SchemaType.System;
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
        await flow.system.data.createAll(SchemaType.Client, clients);
    }
}
