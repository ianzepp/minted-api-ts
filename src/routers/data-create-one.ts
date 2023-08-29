import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {

    }

    onHttpVerb() {
        return HttpRouter.POST;
    }

    onHttpPath() {
        return '/api/data/:schema/:record';
    }
}