import _ from 'lodash';

// Classes
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';
import { Record } from '@system/classes/record';

export default class extends Action {
    constructor() {
        super(__filename);
    }
    
    async run({ kernel, object, change }: Signal) {
        let created_at = kernel.time;
        let created_by = kernel.user_id;
        let created_ns = kernel.user.ns;

        // Track change `data` and `meta` for the eventual insert op
        let record_data = [];
        let record_meta = [];

        // If running as root, set the default user
        let is_root = kernel.isRoot();

        change.forEach(({ data, meta }: Record) => {
            if (is_root) {
                data.id = data.id ?? kernel.uuid();
                data.ns = data.ns ?? created_ns;

                // Created info may already exist
                meta.created_at = meta.created_at ?? created_at;
                meta.created_by = meta.created_by ?? created_by;

                // The other meta types may or may not be passed in by root
            }

            else {
                data.id = kernel.uuid();
                data.ns = created_ns;

                // Standard timestamps
                meta.created_at = created_at;
                meta.created_by = created_by;

                // meta properties that can't be set by the user
                meta.updated_at = null;
                meta.updated_by = null;
                meta.expired_at = null;
                meta.expired_by = null;
                meta.deleted_at = null;
                meta.deleted_by = null;
            }

            // Add to the lists
            record_data.push(_.assign({}, data));
            record_meta.push(_.assign({}, meta, { id: data.id, ns: data.ns }));
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
