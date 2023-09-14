import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        this.kernel.acls.upsertOne(this.params.schema, this.params.record, this.req.body);
    }

    onHttpVerb() {
        return Router.Verb.Put;
    }

    onHttpPath() {
        return '/api/acls/:schema/:record';
    }
}