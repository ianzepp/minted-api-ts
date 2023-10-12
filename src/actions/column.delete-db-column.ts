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

    async run(signal: Signal): Promise<void> {
        for(let record of signal.change) {
            // Sanity
            record.expect('name').a('string');
            record.expect('name').contains('.');

            // Create temporary refs
            let [object_name, column_name] = record.data.name.split('.');

            // Verify object exists
            let object = signal.kernel.meta.objects.get(object_name);
            let column = object.columns[column_name];

            if (column === undefined) {
                throw new Error(`Object '${ object_name }' column '${ column_name }' does not exist or is not visible.`)
            }

            // Run
            await signal.kernel.knex.updateTable(object_name, t => {
                t.dropColumn(column_name);
            });

            // Delete the column data from the parent object
            object.remove(column_name);

            // Delete the column data from the kernel metadata
            signal.kernel.meta.columns.delete(record.data.name);
        }
    }
}
