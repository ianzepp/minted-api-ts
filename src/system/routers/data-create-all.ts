import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.createAll(params.object, body);
    }

    onRouterVerb() {
        return 'POST';
    }

    onRouterPath() {
        return '/api/data/:object';
    }

    isRouterBody(body: unknown) {
        return body instanceof Array;
    }
}