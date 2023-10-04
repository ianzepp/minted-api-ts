import _ from 'lodash';

// Classes
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ActionRing } from '@typedefs/neuron';
import { DataError } from '@classes/kernel-data';


export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return '*';
    }

    onRing(): ActionRing {
        return ActionRing.Knex;
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
        signal.change.forEach(record => {
            record.data.id = signal.kernel.uuid();
            record.data.ns = signal.kernel.user_ns;
            record.meta.created_at = created_at;
            record.meta.created_by = created_by;
        });
    }

    async run(signal: Signal): Promise<void> {
        let creates_data = await signal.kernel.data
            .driverTo(signal.object.name, 'data')
            .insert(signal.change_data);

        let creates_meta = await signal.kernel.data
            .driverTo(signal.object.name, 'meta')
            .insert(signal.change_meta);
    }
}
