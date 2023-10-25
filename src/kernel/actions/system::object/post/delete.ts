import _ from 'lodash';

// Classes
import { Action } from '@kernel/classes/action';
import { Signal } from '@kernel/classes/signal';
import { Object } from '@kernel/classes/object';
import { Record } from '@kernel/classes/record';

export default class extends Action {
    constructor() {
        super(__filename, { series: true });
    }

    async one({ kernel }: Signal, record: Record) {
        // Sanity
        record.expect('name').a('string');
        record.expect('name').not.contains('.');

        // Create the object
        let object = Object.from(record.data);

        // Delete related columns
        await kernel.data.deleteAny('system::column', {
            where: {
                $or: [
                    { name: `${ object.system_name }.%` },
                    { name: `${ object.object_name }.%` },
                ]
            }
        });

        // Create the empty table with no default columns
        await kernel.knex.deleteTable(object.system_name);
    }
}
