import _ from 'lodash';

// API
import { HttpRouter } from '@classes/http-router';

// Implementation
export default class extends HttpRouter {
    async run() {
        
    }

    onHttpVerb() {
        return HttpRouter.Verb.Put;
    }

    onHttpPath() {
        return '/api/meta/import';
    }
}