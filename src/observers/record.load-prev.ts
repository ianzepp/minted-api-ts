import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverRing } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Schema } from '../classes/schema';
import { RecordFlat } from '../classes/record';

export default class extends Observer {
    toName(): string {
        return 'record.load-prev';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return Observer.Ring.Init;
    }

    onUpdate(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        let result: RecordFlat[] = await flow.statement.whereIn('id', flow.change_ids).select();
        let result_map = _.keyBy(result, 'id');

        // Assign the raw knex data for previous values to the records
        for(let record of flow.change) {
            let record_prev = result_map[record.data.id];

            if (record_prev === undefined) {
                continue; // TODO Is this an error? We have an ID but no record found?
            }

            record.fromRecordPrev(record_prev);
        }
    }
}