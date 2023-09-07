import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverRing } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Schema } from '../classes/schema';
import { KnexDriver } from '../classes/knex';

export default class extends Observer {
    toName(): string {
        return 'record.knex-update';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return Observer.Ring.Knex;
    }

    onUpdate(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        // Define the top-level knex change.
        let schema_name = flow.schema.schema_name;
        let knex = flow.system.knex.toTx(schema_name)

        // Unfortunately, knex requires record updates be done individually. We can help
        // reduce the load by running all the changes in parallel as Promises
        let changed_set = flow.change.map(record => {
            return flow.system.knex.toTx(schema_name, 'data')
                .where('data.id', record.data.id)
                .update(record.data);
        });

        // Wait for completion
        await Promise.all(changed_set);

        // Once the data updates are done, the timestamps can be set all at once.
        let changed_at = flow.system.timestamp;
        let changed_by = flow.system.user.id;

        // Set timestamps
        await flow.system.knex.toTx(schema_name + '_info', 'info')
            .whereIn('info.ns', flow.system.namespaces)
            .whereIn('info.id', flow.change.map(record => record.data.id))
            .whereNull('info.expired_at')   // record was not previously expired
            .whereNull('info.deleted_at')   // record was not previously deleted
            .update({ updated_at: changed_at, updated_by: changed_by });

        // Apply the timestamp changes back to the records
        _.each(flow.change, record => {
            record.info.updated_at = changed_at;
            record.info.updated_by = changed_by;
        });
    }
}