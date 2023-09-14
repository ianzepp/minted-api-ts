import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.upsertAll(this.req.params.schema, this.req.body);
    }

    onHttpVerb() {
        return Router.Verb.Put;
    }

    onHttpPath() {
        return '/api/data/:schema';
    }
}