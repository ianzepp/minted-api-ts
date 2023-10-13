import _ from 'lodash';

// API
import { Router } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.bulk.process(this.req.body);
    }

    onRouterVerb() {
        return Router.Verb.Post;
    }

    onRouterPath() {
        return '/api/bulk';
    }
}