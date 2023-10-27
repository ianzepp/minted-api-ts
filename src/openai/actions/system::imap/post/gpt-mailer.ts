import _ from 'lodash';
import { marked } from 'marked';

// Debugging
const debug = require('debug')('minted:actions:openai:gpt-mailer');

// Classes
import { Column } from '@kernel/classes/column';
import { Action } from '@kernel/classes/action';
import { Record } from '@kernel/classes/record';
import { Signal } from '@kernel/classes/signal';

// Locals
import { OpenAiChat } from '../../../classes/openai-chat';

export default class extends Action {
    constructor() {
        super(__filename, { series: true });
    }

    async one(signal: Signal, record: Record) {
        // Do any of the `to` emails match our SMTP configuration?
        if (this.isMatchedTo(record.data.head) === false) {
            return debug(`WARN: mail TO header "${ record.data.head.to }" did not match SMTP_USER "${ Bun.env.SMTP_USER }"`);
        }

        debug('Asking GPT:');
        debug('- from:', record.data.head.from);
        debug('- subject:', record.data.head.subject);

        let gpt = await OpenAiChat.from(signal.kernel, 'gpt-3.5-turbo');
        gpt.system('You are an email assistant. You read emails and try to respond appropriately.');
        gpt.system('The email below is from a user, addressing you directly with a request. Read the entire email (and the email thread if needed) before deciding how to repy.');
        gpt.send(record.data.text || record.data.html);

        // Wait for the response
        let result = await gpt.sync();

        if (this.isIgnored(result)) {
            return debug('GPT does not wish to respond.');
        }

        debug('GPT responded:', result);

        // Build html and text versions
        let result_html = marked.parse(result)
            + `<blockquote type="cite>`
            + `------- Original Message -------<br/>`
            + `On "${ record.data.head.date }", ${ record.data.head.from } wrote:<br/><br/>`
            + `${ record.data.html || record.data.textAsHtml }`
            + `</blockquote>`;

        let result_text = result
            + `\n`
            + `------- Original Message -------\n`
            + `On "${ record.data.head.date }", ${ record.data.head.from } wrote:\n\n`
            + `${ record.data.text }`
            + `\n`;

        // Create the SMTP email
        await signal.kernel.data.createOne('system::smtp', {
            rn: `GPT response to "${ record.data.head.from }"`,
            to: this.toSmtpTo(record),
            cc: this.toSmtpCC(record),
            subject: this.toSmtpSubject(record),
            from: Bun.env.SMTP_USER,
            html: result_html,
            text: result_text
        });

        // Done.
    }

    //
    // Helpers
    //

    isMatchedTo(head: _.Dictionary<any>) {
        return (head.to instanceof Array && head.to.includes(Bun.env.SMTP_USER))
            || (head.to && head.to === Bun.env.SMTP_USER);
    }

    isIgnored(result: string) {
        return (result && result === 'IGNORE')
            || (result === null)
            || (result === undefined);
    }

    //
    // Build the SMTP response parts
    //

    toUniq(... addresses: string[]) {
        return _.map(_.uniq(_.compact(_.flatten(addresses))), _.toLower);
    }

    toSmtpTo(record: Record) {
        return _.without(this.toUniq(record.data.head.to, record.data.head.from), Bun.env.SMTP_USER)
    }

    toSmtpCC(record: Record) {
        return _.without(this.toUniq(record.data.head.cc), Bun.env.SMTP_USER)
    }

    toSmtpSubject(record: Record) {
        let subject = record.data.head.subject || '';
        return subject.match(/^RE:/i) ? subject : `RE: ${ subject }`;
    }
}
