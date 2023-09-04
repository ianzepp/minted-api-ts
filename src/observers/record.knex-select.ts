import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Record } from '../classes/record';

export default class extends Observer {
    toName() {
        return 'record.knex-select';
    }
    
    onSchema() {
        return 'record';
    }

    onRing() {
        return Observer.Ring.Knex;
    }

    onSelect() {
        return true;
    }

    async run(flow: ObserverFlow) {
        // Build the request statement
        let knex = flow.system.knex.toStatementFilter(flow.schema_name, flow.filter).select();

        // Wait for the result
        let result = await knex;

        // Convert the raw results into records
        let select = _.map(result, data => new Record(flow.schema_name).fromRecordFlat(data));

        // Reset change list and add to results
        flow.change.length = 0;
        flow.change.push(... select);
    }
}