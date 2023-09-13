import _ from 'lodash';

// API
import { HttpRouter } from '@classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.kernel.data.updateAll(this.req.params.schema, this.req.body);
    }

    onHttpVerb() {
        return HttpRouter.Verb.Patch;
    }

    onHttpPath() {
        return '/api/data/:schema';
    }
}