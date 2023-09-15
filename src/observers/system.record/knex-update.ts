import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Thread } from '@classes/thread';
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

    async startup(thread: Thread) {
        let exceptions = thread.change.filter(record => typeof record.data.id !== 'string');

        if (exceptions.length) {
            throw new DataError('One or more records are missing IDs');
        }
    }


    async run(thread: Thread) {
        return Promise.all(thread.change.map(record => this.one(thread, record)));
    }

    async one(thread: Thread, record: Record) {
        return thread.kernel.knex
            .driverTo(thread.schema.name, 'data')
            .whereIn('data.id', [record.data.id])
            .update(record.diff);
    }

    async cleanup(thread: Thread) {
        thread.change.forEach(record => {
            record.meta.updated_at = thread.kernel.time;
            record.meta.updated_by = thread.kernel.user_id;
        });
    }
}