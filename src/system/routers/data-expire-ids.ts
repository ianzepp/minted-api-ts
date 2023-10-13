import _ from 'lodash';

// API
import { Router } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.expireIds(this.req.params.object, [this.req.params.record]);
    }

    onRouterVerb() {
        return Router.Verb.Delete;
    }

    onRouterPath() {
        return '/api/data/:object/:record';
    }
}