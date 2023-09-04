import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.deleteIds(this.req.params.schema, [this.req.params.record]);
    }

    onHttpVerb() {
        return HttpRouter.Verb.Delete;
    }

    onHttpPath() {
        return '/api/data/:schema/:record';
    }
}