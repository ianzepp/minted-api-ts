import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, search }: RouterInit) {
        return kernel.data.searchAny(params.object, {}, {}, 1000);
    }

    onRouterVerb() {
        return 'GET';
    }

    onRouterPath() {
        return '/api/data/:object';
    }
}