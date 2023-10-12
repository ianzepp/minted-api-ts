import _ from 'lodash';

// Classes
import { Action } from '@classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ActionRing } from '@typedefs/action';
import { ObjectType } from '@typedefs/object';
import { Column } from '@classes/column';


export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return ObjectType.Column;
    }

    onRing(): ActionRing {
        return ActionRing.Post;
    }

    onDelete(): boolean {
        return true;
    }

    isSeries(): boolean {
        return true;
    }

    async one(signal: Signal, record: Record): Promise<void> {
        // Sanity
        record.expect('name').a('string');
        record.expect('name').contains('.');

        // Find the parent object
        let column = Column.from(record.data);
        let object = signal.kernel.meta.lookup(column.object_name);

        // Drop column
        await signal.kernel.knex.updateTable(object.system_name, t => {
            t.dropColumn(column.system_name);
        });
    }
}
