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

    onExpire(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        return flow.kernel.knex
            .driverTo(flow.schema.schema_name, 'meta')
            .whereIn('id', _.map(flow.change_data, 'id'))
            .update({
                expired_at: flow.kernel.time,
                expired_by: flow.kernel.user_id
            });
    }

    async cleanup(flow: ObserverFlow) {
        flow.change.forEach(record => {
            record.meta.expired_at = flow.kernel.time;
            record.meta.expired_by = flow.kernel.user_id;
        })
    }
}