import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverRing } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';

export default class extends Observer {
    toName(): string {
        return 'record.knex-select';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return Observer.Ring.Knex;
    }

    onSelect(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
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