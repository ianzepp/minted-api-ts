import _ from 'lodash';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';
import { Record } from '@system/classes/record';

// Typedefs
import { Column } from '@system/classes/column';


export default class extends Action {
    constructor() {
        super(__filename, { series: true });
    }

    async one({ kernel }: Signal, record: Record) {
        record.expect('name').a('string');
        record.expect('name').contains('.');

        // Find the parent object
        let column = Column.from(record.data);
        let object = kernel.meta.lookup(column.object_name);

        // Drop column
        await kernel.knex.updateTable(object.system_name, t => {
            t.dropColumn(column.system_name);
        });
    }
}
