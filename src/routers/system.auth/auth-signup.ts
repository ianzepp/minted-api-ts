import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        // TODO
    }

    onRouterVerb() {
        return Router.Verb.Post;
    }

    onRouterPath() {
        return '/api/auth/signup';
    }
}