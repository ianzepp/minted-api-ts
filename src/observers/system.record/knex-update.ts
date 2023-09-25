import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ObserverRing } from '@typedefs/observer';
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

    async startup(thread: Signal) {
        let exceptions = thread.change.filter(record => typeof record.data.id !== 'string');

        if (exceptions.length) {
            throw new DataError('One or more records are missing IDs');
        }
    }


    async run(thread: Signal) {
        return Promise.all(thread.change.map(record => this.one(thread, record)));
    }

    async one(thread: Signal, record: Record) {
        return thread.kernel.knex
            .driverTo(thread.schema.name, 'data')
            .whereIn('data.id', [record.data.id])
            .update(record.diff);
    }

    async cleanup(thread: Signal) {
        thread.change.forEach(record => {
            record.meta.updated_at = thread.kernel.time;
            record.meta.updated_by = thread.kernel.user_id;
        });
    }
}