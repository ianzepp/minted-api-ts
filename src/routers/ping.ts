import _ from 'lodash';

// API
import { HttpRouter } from '@classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        return { 
            pong: new Date().toISOString(),
            user: this.kernel.user_id
        };
    }

    onHttpVerb() {
        return HttpRouter.Verb.Get;
    }

    onHttpPath() {
        return '/api/ping';
    }
}