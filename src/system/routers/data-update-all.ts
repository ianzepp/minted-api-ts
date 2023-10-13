import _ from 'lodash';

// API
import { Router } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.updateAll(this.req.params.object, this.req.body);
    }

    onRouterVerb() {
        return Router.Verb.Patch;
    }

    onRouterPath() {
        return '/api/data/:object';
    }
}