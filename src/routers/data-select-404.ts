import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';
import head404 from '../helpers/head404';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.select404(this.req.params.schema, this.req.params.record);
    }

    onHttpVerb() {
        return HttpRouter.GET;
    }

    onHttpPath() {
        return '/api/data/:schema/:record';
    }
}