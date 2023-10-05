import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return {  pong: new Date().toISOString() }
    }

    onRouterVerb() {
        return Router.Verb.Get;
    }

    onRouterPath() {
        return '/api/ping';
    }
}