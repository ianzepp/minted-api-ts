import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.meta.import(this.req.body);
    }

    onHttpVerb() {
        return HttpRouter.PUT;
    }

    onHttpPath() {
        return '/api/meta/import';
    }
}