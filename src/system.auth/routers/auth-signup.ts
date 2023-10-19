import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        // TODO
    }

    onRouterVerb() {
        return 'POST';
    }

    onRouterPath() {
        return '/api/auth/signup';
    }
}