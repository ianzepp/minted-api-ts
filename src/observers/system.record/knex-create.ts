import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { Record } from '@classes/record';

// Layouts
import { ObserverRing } from '@layouts/observer';
import { DataError } from '@classes/kernel-data';


export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return '*';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
    }

    onCreate(): boolean {
        return true;
    }

    async startup(flow: ObserverFlow): Promise<void> {
        // Set ID and namespace. It is possible they are already set, if we are running as root and
        // the root user supplied the IDs. 
        //
        // See the testing / precheck login in `test-create.ts`.
        flow.change.forEach(record => {
            record.data.id = record.data.id || flow.kernel.uuid();
            record.data.ns = record.data.ns || flow.kernel.user_ns;
        });
    }

    async run(flow: ObserverFlow): Promise<void> {
        let creates = await flow.kernel.knex
            .driverTo(flow.schema.schema_name, 'data')
            .insert(flow.change_data)
            .returning('*');

        for(let i in flow.change) {
            let create = creates[i];
            let change = flow.change[i];

            _.assign(change.data, create);
        }
    }

    async cleanup(flow: ObserverFlow): Promise<void> {
        flow.change.forEach(record => {
            record.meta.created_at = flow.kernel.time;
            record.meta.created_by = flow.kernel.user_id;
        });
    }

}
