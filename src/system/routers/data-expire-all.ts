import _ from 'lodash';

// API
import { Filter } from '@system/classes/filter';
import { Router } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.expireAll(this.params.object, this.req.body);
    }

    onRouterVerb() {
        return Router.Verb.Delete;
    }

    onRouterPath() {
        return '/api/data/:object';
    }
}
