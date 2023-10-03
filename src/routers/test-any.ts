import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {

    }

    onRouterVerb() {
        return Router.Verb.Get;
    }

    onHttpPath() {
        return '/api/test/:name';
    }
}