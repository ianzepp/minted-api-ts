import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { Record } from '@classes/record';

// Layouts
import { ObserverRing } from '@layouts/observer';
import { DataError } from '@classes/kernel-data';


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

    onUpdate(): boolean {
        return true;
    }

    async startup(flow: ObserverFlow) {
        let exceptions = flow.change.filter(record => typeof record.data.id !== 'string');

        if (exceptions.length) {
            throw new DataError('One or more records are missing IDs');
        }
    }


    async run(flow: ObserverFlow) {
        return Promise.all(flow.change.map(record => this.one(flow, record)));
    }

    async one(flow: ObserverFlow, record: Record) {
        return flow.kernel.knex
            .driverTo(flow.schema.schema_name, 'data')
            .whereIn('data.id', [record.data.id])
            .update(record.diff);
    }

    async cleanup(flow: ObserverFlow) {
        flow.change.forEach(record => {
            record.meta.updated_at = flow.kernel.time;
            record.meta.updated_by = flow.kernel.user_id;
        });
    }
}