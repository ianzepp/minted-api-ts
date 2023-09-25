import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Signal } from '@classes/signal';

// Typedefs
import { ObserverRing } from '@typedefs/observer';
import { RecordFlat } from '@typedefs/record';

/**
 * This observer runs onUpdate() to reload prior data from the DB, so the `Record` has a full view of
 * all previous state.
 */
export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return '*';
    }

    onRing(): ObserverRing {
        return ObserverRing.Init;
    }

    onUpdate(): boolean {
        return true;
    }

    async run(thread: Signal): Promise<void> {
        // Easiest to use the existing data service to reselect record data
        let result = await thread.kernel.data.selectAll(thread.schema, thread.change);
        let result_map = _.keyBy(result, 'data.id');

        // Assign the raw knex data for previous values to the records
        for(let record of thread.change) {
            let record_prev = result_map[record.data.id];

            if (record_prev === undefined) {
                continue; // TODO Is this an error? We have an ID but no record found?
            }

            _.assign(record.prev, record_prev.data);
            _.assign(record.meta, record_prev.meta);
        }
    }
}