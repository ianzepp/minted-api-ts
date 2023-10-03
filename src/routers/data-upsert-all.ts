import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.upsertAll(this.req.params.object, this.req.body);
    }

    onRouterVerb() {
        return Router.Verb.Put;
    }

    onHttpPath() {
        return '/api/data/:object';
    }
}