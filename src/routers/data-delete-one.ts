import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return {}; // TODO
    }

    onHttpVerb() {
        return HttpRouter.DELETE;
    }

    onHttpPath() {
        return '/api/data/:schema/:record';
    }
}