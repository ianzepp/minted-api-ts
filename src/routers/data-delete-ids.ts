import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.deleteIds(this.req.params.schema, [this.req.params.record]);
    }

    onHttpVerb() {
        return Router.Verb.Delete;
    }

    onHttpPath() {
        return '/api/data/:schema/:record';
    }
}