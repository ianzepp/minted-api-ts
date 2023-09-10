import _ from 'lodash';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';

// Layouts
import { ObserverRing } from '../../layouts/observer';
import { RecordFlat } from '../../layouts/record';
import { SchemaType } from '../../classes/schema';


export default class extends Observer {
    toName(): string {
        return 'record.select-prev';
    }
    
    onSchema(): string {
        return SchemaType.Record;
    }

    onRing(): ObserverRing {
        return ObserverRing.Init;
    }

    onUpdate(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        // Easiest to use the existing data service to reselect record data
        let record_ids = flow.change.map(record => record.data.id);
        let result = await flow.system.data.selectIds(flow.schema, record_ids);

        // Convert the result list to a mapping by ID
        let result_map = _.keyBy(result, 'data.id');

        // Assign the raw knex data for previous values to the records
        for(let record of flow.change) {
            let record_prev = result_map[record.data.id];

            if (record_prev === undefined) {
                continue; // TODO Is this an error? We have an ID but no record found?
            }

            _.assign(record.prev, record_prev.data);
            _.assign(record.meta, record_prev.meta);
            _.assign(record.acls, record_prev.acls);
        }
    }
}