import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {

    }

    onHttpVerb() {
        return HttpRouter.GET;
    }

    onHttpPath() {
        return '/api/test/:name';
    }
}