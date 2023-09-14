import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.selectAny(this.req.params.schema, this.req.body || {});
    }

    onHttpVerb() {
        return Router.Verb.Post;
    }

    onHttpPath() {
        return '/api/find/:schema';
    }
}