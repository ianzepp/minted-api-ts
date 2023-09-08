import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Schema } from '../classes/schema';

// Layouts
import { ObserverRing } from '../layouts/observer';
import { RecordFlat } from '../layouts/record';


export default class extends Observer {
    toName(): string {
        return 'record.load-prev';
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
        let schema_name = flow.schema.schema_name;

        let result = await flow.system.knex.toTx(schema_name, 'data')
            .whereIn('data.ns', flow.system.namespaces)
            .whereIn('data.id', flow.change.map(record => record.data.id))
            .select();

        // Convert the result list to a mapping by ID
        let result_map = _.keyBy(result, 'id');

        // Assign the raw knex data for previous values to the records
        for(let record of flow.change) {
            let record_prev = result_map[record.data.id];

            if (record_prev === undefined) {
                continue; // TODO Is this an error? We have an ID but no record found?
            }

            _.assign(record.prev, record_prev);
        }
    }
}