import _ from 'lodash';

// Classes
import { AutoInstall } from '@classes/autoinstall';
import { Action } from '@classes/action';
import { Signal } from '@classes/signal';
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

        // Setup
        let object_name = record.data.name;

        // Delete related columns
        await signal.kernel.data.deleteAny(ObjectType.Column, {
            where: {
                name: `${ object_name }.%`
            }
        });

        // Create the empty table with no default columns
        await signal.kernel.knex.deleteTable(object_name);
    }
}
