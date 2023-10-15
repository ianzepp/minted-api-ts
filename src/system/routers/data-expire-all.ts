import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.expireAll(params.object, body);
    }

    onRouterVerb() {
        return 'DELETE';
    }

    onRouterPath() {
        return '/api/data/:object';
    }

    isRouterBody(body: unknown) {
        return _.isArray(body);
    }
}
