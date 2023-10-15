import _ from 'lodash';

// API
import { Router } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run() {
        return {  pong: new Date().toISOString() }
    }

    onRouterVerb() {
        return 'GET';
    }

    onRouterPath() {
        return '/api/test/ping';
    }
}