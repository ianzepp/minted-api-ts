import _ from 'lodash';

// Classes
import { Action } from '@classes/action';
import { Signal } from '@classes/signal';
import { Object } from '@classes/object';
import { Record } from '@classes/record';

// Typedefs
import { ActionRing } from '@typedefs/action';
import { ObjectType } from '@typedefs/object';

export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return ObjectType.Object;
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

    async one(signal: Signal, record: Record) {
        // Sanity
        record.expect('name').a('string');
        record.expect('name').not.contains('.');

        // Create the object
        let object = Object.from(record.data);

        // Delete related columns
        await signal.kernel.data.deleteAny(ObjectType.Column, {
            where: {
                $or: [
                    { name: `${ object.system_name }.%` },
                    { name: `${ object.object_name }.%` },
                ]
            }
        });

        // Create the empty table with no default columns
        await signal.kernel.knex.deleteTable(object.system_name);
    }
}
