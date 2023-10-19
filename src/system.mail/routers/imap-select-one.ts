import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.search404('system::imap', { name: params.record });
    }

    onRouterVerb() {
        return 'GET';
    }

    onRouterPath() {
        return '/api/imap/:message';
    }
}