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
        let deleted_at = flow.system.timestamp;
        let deleted_by = flow.system.user_id;

        // Run the op
        await flow.system.knex
            .driverTo(flow.schema.schema_name, 'meta')
            .whereIn('id', flow.change_ids)
            .update({  deleted_at: deleted_at, deleted_by: deleted_by });

        // Apply the timestamp changes back to the records
        for(let record of flow.change) {
            record.meta.deleted_at = deleted_at;
            record.meta.deleted_by = deleted_by;
        }
    }
}