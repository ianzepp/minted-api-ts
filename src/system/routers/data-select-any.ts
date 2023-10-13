import _ from 'lodash';

// API
import { Router } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.selectAny(this.req.params.object, this.req.body);
    }

    onRouterVerb() {
        return Router.Verb.Get;
    }

    onRouterPath() {
        return '/api/data/:object';
    }
}