import _ from 'lodash';

// Classes
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ActionRing } from '@root/src/typedefs/action';
import { RecordFlat } from '@typedefs/record';

export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return 'smtp';
    }

    onRing(): ActionRing {
        return ActionRing.Flow;
    }

    onCreate(): boolean {
        return true;
    }

    isParallel(): boolean {
        return true;
    }

    async one(signal: Signal, record: Record): Promise<void> {
        return signal.kernel.smtp.send(record.data.mail);
    }
}