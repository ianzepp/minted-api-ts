import _ from 'lodash';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';
import { Record } from '@system/classes/record';

// Typedefs
import { ActionRing } from '@system/typedefs/action';
import { DataError } from '@system/kernels/kernel-data';
import { sign } from 'jsonwebtoken';


export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return '*';
    }

    onRing(): ActionRing {
        return ActionRing.Database;
    }

    onCreate(): boolean {
        return true;
    }

    async run({ kernel, object, change }: Signal) {
        let created_at = kernel.time;
        let created_by = kernel.user_id;

        // Track change `data` and `meta` for the eventual insert op
        let record_data = [];
        let record_meta = [];

        // If running as root, set the default user
        let is_root = kernel.isRoot();

        change.forEach(record => {
            if (is_root) {
                record.data.id = record.data.id ?? kernel.uuid();
                record.data.ns = record.data.ns ?? kernel.user_ns;

                // Created info may already exist
                record.meta.created_at = record.meta.created_at ?? created_at;
                record.meta.created_by = record.meta.created_by ?? created_by;

                // The other meta types may or may not be passed in by root
            }

            else {
                record.data.id = kernel.uuid();
                record.data.ns = kernel.user_ns;

                // Standard timestamps
                record.meta.created_at = created_at;
                record.meta.created_by = created_by;

                // meta properties that can't be set by the user
                record.meta.updated_at = null;
                record.meta.updated_by = null;
                record.meta.expired_at = null;
                record.meta.expired_by = null;
                record.meta.created_at = null;
                record.meta.created_by = null;
            }

            // Add to the lists
            record_data.push(_.assign({}, record.data));
            record_meta.push(_.assign({}, record.meta, { id: record.data.id, ns: record.data.ns }));
        });

        // Create `data`
        let creates_data = await kernel.knex
            .driverTo(object.system_name, 'data')
            .insert(record_data);

        // Create `meta`
        let creates_meta = await kernel.knex
            .driverTo(object.system_name, 'meta')
            .insert(record_meta);        
    }
}
