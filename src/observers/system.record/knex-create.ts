import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { Record } from '@classes/record';

// Layouts
import { ObserverRing } from '@layouts/observer';
import { DataError } from '@classes/system-data';


export default class extends Observer {
    toName(): string {
        return 'record.knex-create';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
    }

    onCreate(): boolean {
        return true;
    }

    async startup(flow: ObserverFlow): Promise<void> {
        let exceptions = flow.change.filter(record => record.data.id);

        if (exceptions.length) {
            throw new DataError('One or more records are already assigned IDs');
        }

        // Set ID and namespace
        flow.change.forEach(record => {
            record.data.id = flow.system.uuid();
            record.data.ns = flow.system.user_ns;
        });
    }

    async run(flow: ObserverFlow): Promise<void> {
        let creates = await flow.system.knex
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
            record.meta.created_at = flow.system.time;
            record.meta.created_by = flow.system.user_id;
        });
    }

}
