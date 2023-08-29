import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.updateAll(this.req.params.schema, this.req.body);
    }

    onHttpVerb() {
        return HttpRouter.PATCH;
    }

    onHttpPath() {
        return '/api/data/:schema';
    }
}