import _ from 'lodash';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';

// Layouts
import { ObserverRing } from '../../layouts/observer';
import { RecordFlat } from '../../layouts/record';


export default class extends Observer {
    toName(): string {
        return 'record.select-prev';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return ObserverRing.Init;
    }

    onUpdate(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        // Easiest to use the existing data service to reselect record data
        let result = await flow.system.data.selectAll(flow.schema, flow.change);
        let result_map = _.keyBy(result, 'data.id');

        // Assign the raw knex data for previous values to the records
        for(let record of flow.change) {
            let record_prev = result_map[record.data.id];

            if (record_prev === undefined) {
                continue; // TODO Is this an error? We have an ID but no record found?
            }

            _.assign(record.prev, record_prev.data);
            _.assign(record.meta, record_prev.meta);
        }
    }
}