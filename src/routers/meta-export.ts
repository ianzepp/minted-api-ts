import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.meta.export();
    }

    onHttpVerb() {
        return HttpRouter.GET;
    }

    onHttpPath() {
        return '/api/meta/export';
    }
}