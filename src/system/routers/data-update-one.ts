import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.updateOne(params.object, body);
    }

    onRouterVerb() {
        return 'PATCH';
    }

    onRouterPath() {
        return '/api/data/:object/:record';
    }
}