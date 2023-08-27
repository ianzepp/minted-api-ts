import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';

export default class extends Observer {
    toName() {
        return 'record.knex-expire';
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
        let expired_at = flow.system.timestamp;
        let expired_by = flow.system.user.id;

        await flow.system.knex.using('metainfo')
            .whereIn('id', record_ids)
            .whereNull('expired_at')
            .whereNull('deleted_at')
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