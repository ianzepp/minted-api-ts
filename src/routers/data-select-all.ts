import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.selectAll(this.req.params.schema, this.req.search);
    }

    onHttpVerb() {
        return HttpRouter.GET;
    }

    onHttpPath() {
        return '/api/data/:schema';
    }
}
