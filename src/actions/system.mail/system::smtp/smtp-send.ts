import _ from 'lodash';
import nodemailer from 'nodemailer';

// Debugging
const debug = require('debug')('minted:actions:system.mail:smtp-send');

// What is the transport configuration
const SMTP = nodemailer.createTransport({
    host: Bun.env.SMTP_HOST,
    port: _.toInteger(Bun.env.SMTP_PORT || '587'),
    secure: Bun.env.SMTP_SECURE === 'true',
    requireTLS: Bun.env.SMTP_SECURE_TLS === 'true',
    auth: {
        user: Bun.env.SMTP_USER,
        pass: Bun.env.SMTP_PASS,
    }
});

// Classes
import { Action } from '@classes/action';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ActionRing } from '@typedefs/action';

export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return 'system::smtp';
    }

    onRing(): ActionRing {
        return ActionRing.Callout;
    }

    onCreate(): boolean {
        return true;
    }

    isSeries(): boolean {
        return true;
    }

    //
    // Execute one record
    //

    async one(signal: Signal, record: Record): Promise<void> {
        debug('sending for record ID', record.data.id);

        let mail = {
            to: record.data.to,
            cc: record.data.cc,
            subject: record.data.subject,
            from: record.data.from,
            text: record.data.text,
            html: record.data.html,
        };

        // Send the mail using the SMTP transport
        let info = await SMTP.sendMail(mail);

        debug('mail sent', info);

        // Delete the message now that it is sent.
        await signal.kernel.data.deleteOne(record.object.system_name, record);
    }
}