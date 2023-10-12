import _ from 'lodash';

// Classes
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ActionRing } from '@root/src/typedefs/action';
import { RecordFlat } from '@typedefs/record';
import { sign } from 'jsonwebtoken';

export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return 'smtp';
    }

    onRing(): ActionRing {
        return ActionRing.Callout;
    }

    onCreate(): boolean {
        return true;
    }

    isRunnable(): boolean {
        return Bun.env.SMTP_TYPE === 'smtp' && !!Bun.env.SMTP_HOST && !!Bun.env.SMTP_USER;
    }

    isParallel(): boolean {
        return true;
    }

    isDetached(): boolean {
        return true;
    }

    async one(signal: Signal, record: Record): Promise<void> {
        let interval = 60;

        // Try to send the mail. If that fails, then wait 60n seconds and try again.
        try {
            await signal.kernel.smtp.send(record.data);
        }

        catch (error) {
            console.trace(error);
            console.warn('Trying again in %d seconds', interval);

            setTimeout(() => {
                console.warn('Retrying SMTP message');
                this.one(signal, record);
            }, 1000 * interval);

            // Bump the interval
            interval = interval * 2;

            // Nothing else to do now. We wait.
            return;
        }

        // Expire the message now that it is sent.
        await signal.kernel.data.expireOne(record.object, record);
    }
}