import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.upsertAll(params.object, body);
    }

    onRouterVerb() {
        return 'PUT';
    }

    onRouterPath() {
        return '/api/data/:object';
    }
}