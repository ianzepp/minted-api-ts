import _ from 'lodash';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { Record } from '../../classes/record';

// Layouts
import { ObserverRing } from '../../layouts/observer';


export default class extends Observer {
    toName(): string {
        return 'record.knex-update';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
    }

    onUpdate(): boolean {
        return true;
    }

    // Knex requires updates be done individually (per row). We can help reduce the load by 
    // running all the changes in parallel as Promises.
    async run(flow: ObserverFlow) {
        return Promise.all(flow.change.map(record => this.updateOne(flow, record)));
    }

    // All data updates must be done in the `system_data` tablespace only.
    // Once the data updates are done, we update the timestamps.
    async updateOne(flow: ObserverFlow, record: Record) {
        if (record.meta.deleted_at) {
            return; // Cannot update
        }

        if (record.meta.expired_at) {
            return; // Cannot update
        }

        let schema_name = flow.schema.schema_name;
        let updated_at = flow.system.timestamp;
        let updated_by = flow.system.user.id;

        await flow.system.knex.toDriverTx('system_data.' + schema_name)
            .whereIn('ns', flow.system.namespaces)
            .whereIn('id', [record.data.id])
            .update(record.data);

        await flow.system.knex.toDriverTx('system_meta.' + schema_name)
            .whereIn('ns', flow.system.namespaces)
            .whereIn('id', [record.data.id])
            .update({
                updated_at: updated_at,
                updated_by: updated_by,
            });

        // With success at the DB level, apply the timestamp back to the record
        record.meta.updated_at = updated_at;
        record.meta.updated_by = updated_by;
    }
}