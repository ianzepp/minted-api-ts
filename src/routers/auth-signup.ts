import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return this.system.auth.signup();
    }

    onHttpVerb() {
        return HttpRouter.Verb.Post;
    }

    onHttpPath() {
        return '/auth/signup';
    }
}