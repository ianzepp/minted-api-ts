import _ from 'lodash';
import chai from 'chai';
import { simpleParser } from 'mailparser';

// API
import { Router } from '@classes/router';
import { ChangeData } from '@typedefs/record';

// Implementation
export default class extends Router {
    async run() {
        // Parse the mail
        let mail = await simpleParser(this.req.body);

        // Remap the headers to a dictionary
        let headers = this.toMailHeaders(mail.headers);

        // Build and return
        return this.kernel.data.createOne('system::imap', {
            name: headers['message-id'],
            head: headers,
            html: mail.html || mail.textAsHtml,
            text: mail.text,
        }).then(r => r.data.name);
    }

    onRouterVerb() {
        return Router.Verb.Post;
    }

    onRouterPath() {
        return '/api/imap';
    }

    //
    // Router helpers
    //

    toMailHeaders(headers: Map<string, any>) {
        return _.transform(Array.from(headers.keys()), (result, name: string) => {
            let data = headers.get(name);

            if (typeof data === 'object' && data.value instanceof Array) {
                data = _.map(data.value, 'address');
            }

            _.set(result, name, data);
        }, {} as _.Dictionary<any>)
    }
}