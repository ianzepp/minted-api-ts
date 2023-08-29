import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.data.select404(this.req.params.schema, {
            limit: 1,
            where: {
                id: this.req.params.record
            }
        });
    }

    onHttpVerb() {
        return HttpRouter.GET;
    }

    onHttpPath() {
        return '/api/data/:schema/:record';
    }
}