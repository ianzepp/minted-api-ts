import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverRing } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Schema } from '../classes/schema';

export default class extends Observer {
    toName(): string {
        return 'record.knex-expire';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return Observer.Ring.Knex;
    }

    onDelete(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        // Once the data updates are done, the timestamps can be set all at once.
        let record_ids = flow.change.map(record => record.data.id);
        let expired_at = flow.system.timestamp;
        let expired_by = flow.system.user.id;

        await flow.system.knex.toTx(flow.schema.schema_name + '_info')
            .whereIn('info.id', record_ids)
            .whereNull('info.expired_at')
            .whereNull('info.deleted_at')
            .update({
                expired_at: expired_at,
                expired_by: expired_by
            });

        // Apply the timestamp changes back to the records
        _.each(flow.change, record => {
            record.info.expired_at = expired_at;
            record.info.expired_by = expired_by;
        });
    }
}