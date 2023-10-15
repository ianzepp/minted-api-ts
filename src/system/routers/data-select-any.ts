import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.selectAny(params.object, body);
    }

    onRouterVerb() {
        return 'GET';
    }

    onRouterPath() {
        return '/api/data/:object';
    }
}