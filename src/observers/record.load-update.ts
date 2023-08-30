import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Record } from '../classes/record';

export default class extends Observer {
    toName() {
        return 'record.load-update';
    }
    
    onSchema() {
        return 'record';
    }

    onRing() {
        return Observer.RING_INIT;
    }

    onUpdate() {
        return true;
    }

    async run(flow: ObserverFlow) {
        let result = await flow.statement.whereIn('id', flow.change_ids).select();
        let result_map = _.keyBy(result, 'id');

        // Assign the raw knex data for previous values to the records
        flow.change.forEach(change => {
            _.assign(change.prev, result_map[change.data.id] || {});
        });

    }
}