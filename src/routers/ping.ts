import _ from 'lodash';

// API
import { Router } from '@classes/router';

// Implementation
export default class extends Router {
    async run() {
        return { 
            pong: new Date().toISOString(),
            user: this.kernel.user_id
        };
    }

    onRouterVerb() {
        return Router.Verb.Get;
    }

    onHttpPath() {
        return '/api/ping';
    }
}