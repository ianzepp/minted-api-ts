import _ from 'lodash';

// Classes
import { DataError } from '@classes/kernel-data';
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ActionRing } from '@root/src/typedefs/action';
import { ObjectType } from '@typedefs/object';
import { extractEmail } from '../classes/helper';

export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return 'mail';
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
        let mailTo = [record.data.head['to'], record.data.head['cc']];

        // Cleanup
        mailTo = _.flattenDeep(mailTo);
        mailTo = _.compact(mailTo);
        mailTo = _.map(mailTo, extractEmail);
        mailTo = _.uniq(mailTo);

        console.warn('mailTo:', mailTo);

        // If the email thread does not includes our GPT bot, then skip the email
        if (mailTo.includes('gpt@mintedgeek.us') === false) {
            return;
        }

        // Process the email data into something useful

    }
}
