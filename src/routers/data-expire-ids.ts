import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.expireIds(this.req.params.object, [this.req.params.record]);
    }

    onRouterVerb() {
        return Router.Verb.Delete;
    }

    onHttpPath() {
        return '/api/data/:object/:record';
    }
}