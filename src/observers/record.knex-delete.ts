import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';

export default class extends Observer {
    toName() {
        return 'record.knex-delete';
    }
    
    onSchema() {
        return 'record';
    }

    onRing() {
        return Observer.RING_KNEX;
    }

    onDelete() {
        return true;
    }

    async run(flow: ObserverFlow) {
        // Once the data updates are done, the timestamps can be set all at once.
        let record_ids = flow.change.map(record => record.data.id);
        let deleted_at = flow.system.timestamp;
        let deleted_by = flow.system.user.id;

        await flow.system.knex.using('metainfo')
            .whereIn('id', record_ids)
            .whereNotNull('expired_at')
            .whereNull('deleted_at')
            .update({
                deleted_at: deleted_at,
                deleted_by: deleted_by
            });

        // Apply the timestamp changes back to the records
        _.each(flow.change, record => {
            record.info.deleted_at = deleted_at;
            record.info.deleted_by = deleted_by;
        });
    }
}