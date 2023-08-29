import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.createAll(this.req.params.schema, this.req.body);
    }

    onHttpVerb() {
        return HttpRouter.POST;
    }

    onHttpPath() {
        return '/api/data/:schema';
    }
}