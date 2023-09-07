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
        let schema_name = flow.schema.schema_name;
        let changed_at = flow.system.timestamp;
        let changed_by = flow.system.user.id;

        await flow.system.knex.toTx(schema_name + '_info', 'info')
            .whereIn('info.ns', flow.system.namespaces)
            .whereIn('info.id', flow.change.map(record => record.data.id))
            .whereNull('info.expired_at')   // record was not previously expired
            .whereNull('info.deleted_at')   // record was not previously deleted
            .update({ expired_at: changed_at, expired_by: changed_by });

        // Apply the timestamp changes back to the records
        _.each(flow.change, record => {
            record.info.expired_at = changed_at;
            record.info.expired_by = changed_by;
        });
    }
}