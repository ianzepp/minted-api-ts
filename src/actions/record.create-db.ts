import _ from 'lodash';

// Classes
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ActionRing } from '@root/src/typedefs/action';
import { DataError } from '@classes/kernel-data';
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

    async startup(signal: Signal): Promise<void> {
        let created_at = new Date().toISOString();
        let created_by = signal.kernel.uuid();

        // Set ID and namespace. It is possible they are already set, if we are running as root and
        // the root user supplied the IDs. 
        //
        // See the testing / precheck login in `test-create.ts`.
        let is_root = signal.kernel.isRoot();

        signal.change.forEach(record => {
            if (is_root) {
                record.data.id = record.data.id ?? signal.kernel.uuid();
                record.data.ns = record.data.ns ?? signal.kernel.user_ns;

                // Created info may already exist
                record.meta.created_at = record.meta.created_at ?? created_at;
                record.meta.created_by = record.meta.created_by ?? created_by;

                // The other meta tpyes may or may not be passed in by root
            }

            else {
                record.data.id = signal.kernel.uuid();
                record.data.ns = signal.kernel.user_ns;

                // Standard timestamps
                record.meta.created_at = created_at;
                record.meta.created_by = created_by;

                // meta properties that can't be set by the user
                record.meta.updated_at = null;
                record.meta.updated_by = null;
                record.meta.expired_at = null;
                record.meta.expired_by = null;
                record.meta.deleted_at = null;
                record.meta.deleted_by = null;
            }
        });
    }

    async run(signal: Signal): Promise<void> {
        let creates_data = await signal.kernel.data
            .driverTo(signal.object.object_name, 'data')
            .insert(signal.change_data);

        let creates_meta = await signal.kernel.data
            .driverTo(signal.object.object_name, 'meta')
            .insert(signal.change_meta);
    }
}
