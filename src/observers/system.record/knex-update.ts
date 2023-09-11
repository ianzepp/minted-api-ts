import _ from 'lodash';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { Record } from '../../classes/record';

// Layouts
import { ObserverRing } from '../../layouts/observer';


export default class extends Observer {
    toName(): string {
        return 'record.knex-update';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
    }

    onUpdate(): boolean {
        return true;
    }

    // Knex requires updates be done individually (per row). We can help reduce the load by 
    // running all the changes in parallel as Promises.
    async run(flow: ObserverFlow) {
        return Promise.all(flow.change.map(record => this.updateOne(flow, record)));
    }

    // All data updates must be done in the `system` tablespace only.
    async updateOne(flow: ObserverFlow, record: Record) {
        return flow.system.knex
            .driverTo(flow.schema.schema_name)
            .whereIn('id', [record.data.id])
            .update(record.data);
    }
}