import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.selectAny(this.req.params.object, this.req.body || {});
    }

    onRouterVerb() {
        return Router.Verb.Post;
    }

    onRouterPath() {
        return '/api/find/:object';
    }
}