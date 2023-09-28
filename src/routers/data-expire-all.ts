import _ from 'lodash';

// API
import { Filter } from '@classes/filter';
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.expireAll(this.params.object, this.req.body);
    }

    onHttpVerb() {
        return Router.Verb.Delete;
    }

    onHttpPath() {
        return '/api/data/:object';
    }
}
