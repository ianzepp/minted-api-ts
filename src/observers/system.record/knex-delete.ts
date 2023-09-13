import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';

// Layouts
import { ObserverRing } from '@layouts/observer';


export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return '*';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
    }

    onDelete(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        return flow.kernel.knex
            .driverTo(flow.schema.schema_name, 'meta')
            .whereIn('id', _.map(flow.change_data, 'id'))
            .update({
                deleted_at: flow.kernel.time,
                deleted_by: flow.kernel.user_id
            });
    }

    async cleanup(flow: ObserverFlow) {
        flow.change.forEach(record => {
            record.meta.deleted_at = flow.kernel.time;
            record.meta.deleted_by = flow.kernel.user_id;
        })
    }
}