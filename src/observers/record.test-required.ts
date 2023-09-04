import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Schema } from '../classes/schema';

export default class extends Observer {
    toName() {
        return 'record.knex-select';
    }
    
    onSchema() {
        return Schema.Type.Record;
    }

    onRing() {
        return Observer.Ring.Test;
    }

    onCreate() {
        return true;
    }

    async run(flow: ObserverFlow) {
        // Filter for 
        let columns = _.filter(flow.schema.columns, 'required');

        // Nothing to do
        if (columns.length === 0) {
            return;
        }

        // Loop records, and then inner loop columns. This minimizes the total
        // number of passes that need to be made. 

        _.each(flow.change, record => {
            _.each(columns, column => {
                if (record.has(column)) {
                    return;
                }

                flow.fail(300, `"${column.column_name}" is required`, record);
            });
        });
   }
}