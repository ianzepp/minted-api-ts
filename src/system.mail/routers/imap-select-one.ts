import _ from 'lodash';

// API
import { Router } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.search404('system::imap', { name: this.params.record });
    }

    onRouterVerb() {
        return Router.Verb.Get;
    }

    onRouterPath() {
        return '/api/imap/:message';
    }
}