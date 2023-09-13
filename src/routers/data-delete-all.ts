import _ from 'lodash';

// API
import { Filter } from '@classes/filter';
import { HttpRouter } from '@classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.kernel.data.deleteAll(this.req.params.schema, this.req.body);
    }

    onHttpVerb() {
        return HttpRouter.Verb.Delete;
    }

    onHttpPath() {
        return '/api/data/:schema';
    }
}
