import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.selectAny(this.req.params.object, this.req.body);
    }

    onHttpVerb() {
        return Router.Verb.Get;
    }

    onHttpPath() {
        return '/api/data/:object';
    }
}