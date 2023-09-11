import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { Record } from '../../classes/record';

// Layouts
import { ObserverRing } from '../../layouts/observer';


export default class extends Observer {
    toName(): string {
        return 'record.knex-create';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
    }

    onCreate(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        // Preprocess data
        let insert_data = flow.change.map((record, i) => {
            record.data.ns = flow.system.user_ns;

            // Done
            return _.omit(record.data, ['id']);
        })

        // Extract the insertion data
        let driver = flow.system.knex.driverTo(flow.schema.schema_name, 'data');
        let created_at = new Date(flow.system.timestamp);
        let created_by = flow.system.user_id;

        // Run the op
        let result_list = await driver.insert(insert_data).returning(['id', 'ns']);

        // Process back into original records
        for(let i in flow.change) {
            let record = flow.change[i];
            let result = result_list[i];

            // Set data properties
            record.data.id = result.id;
            record.data.ns = result.ns;

            // Set meta properties
            record.meta.created_at = created_at;
            record.meta.created_by = created_by;
        }
    }
}
