import _ from 'lodash';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';

// Layouts
import { ObserverRing } from '../../layouts/observer';


export default class extends Observer {
    toName(): string {
        return 'record.knex-delete';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
    }

    onDelete(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        // Once the data updates are done, the timestamps can be set all at once.
        let schema_name = flow.schema.schema_name;
        let record_ids = flow.change.map(record => record.data.id);
        let deleted_at = flow.system.timestamp;
        let deleted_by = flow.system.user.id;

        // Generate a knex raw command to mark records as deleted, where 
        //
        // 1. record is visible to the user
        // 2. record was not previously deleted
        //
        // All timestamps are in the `system_meta` tablespace, so we only use that.
        await flow.system.knex.toDriverTx('system_meta.' + schema_name)
            .whereIn('ns', flow.system.namespaces)
            .whereIn('id', record_ids)
            .whereNull('deleted_at')
            .update({ 
                deleted_at: deleted_at, 
                deleted_by: deleted_by
            });

        // Apply the timestamp changes back to the records
        for(let record of flow.change) {
            record.meta.deleted_at = deleted_at;
            record.meta.deleted_by = deleted_by;
        }
    }
}