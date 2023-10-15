import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.createOne(params.object, body);
    }

    onRouterVerb() {
        return 'POST';
    }

    onRouterPath() {
        return '/api/data/:object';
    }

    isRouterBody(body: unknown) {
        return typeof body === 'object';
    }
}