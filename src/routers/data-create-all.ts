import _ from 'lodash';

// API
import { HttpRouter } from '@classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.kernel.data.createAll(this.req.params.schema, this.req.body);
    }

    onHttpVerb() {
        return HttpRouter.Verb.Post;
    }

    onHttpPath() {
        return '/api/data/:schema';
    }
}