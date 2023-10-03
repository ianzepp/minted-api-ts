import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.auth.signin();
    }

    onHttpVerb() {
        return Router.Verb.Post;
    }

    onHttpPath() {
        return '/auth/signin';
    }
}