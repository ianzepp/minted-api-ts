import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.createAll(this.req.params.object, this.req.body);
    }

    onRouterVerb() {
        return Router.Verb.Post;
    }

    onHttpPath() {
        return '/api/data/:object';
    }
}