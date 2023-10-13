import _ from 'lodash';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';
import { Record } from '@system/classes/record';

// Typedefs
import { ActionRing } from '@system/typedefs/action';
import { ObjectType } from '@system/typedefs/object';
import { Column } from '@system/classes/column';


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
