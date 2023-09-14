import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        // TODO
    }

    onHttpVerb() {
        return Router.Verb.Delete;
    }

    onHttpPath() {
        return '/api/acls/:schema/:record';
    }
}