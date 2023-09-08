import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Schema } from '../classes/schema';

// Layouts
import { ObserverRing } from '../layouts/observer';


export default class extends Observer {
    toName(): string {
        return 'record.knex-expire';
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
        let expired_at = flow.system.timestamp;
        let expired_by = flow.system.user.id;

        // Generate a knex raw command to mark records as expired where:
        //
        // 1. record was not previously expired
        // 2. record was not previously deleted
        //
        // All timestamps are in the `system_meta` tablespace, so we only use that.
        await flow.system.knex.toTx('system_meta.' + schema_name)
            .whereIn('ns', flow.system.namespaces)
            .whereIn('id', record_ids)
            .whereNull('expired_at') 
            .whereNull('deleted_at')
            .update({ 
                expired_at: expired_at, 
                expired_by: expired_by
            });

        // Apply the timestamp changes back to the records
        for(let record of flow.change) {
            record.meta.expired_at = expired_at;
            record.meta.expired_by = expired_by;
        }
    }
}