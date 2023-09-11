import _ from 'lodash';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';

// Layouts
import { ObserverRing } from '../../layouts/observer';


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

    onExpire(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        let expired_at = flow.system.timestamp;
        let expired_by = flow.system.user_id;

        // Run the op
        await flow.system.knex
            .driverTo(flow.schema.schema_name, 'meta')
            .whereIn('id', flow.change_ids)
            .update({  expired_at: expired_at, expired_by: expired_by });

        // Apply the timestamp changes back to the records
        for(let record of flow.change) {
            record.meta.expired_at = expired_at;
            record.meta.expired_by = expired_by;
        }
    }
}