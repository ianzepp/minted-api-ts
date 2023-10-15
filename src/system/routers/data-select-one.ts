import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.select404(params.object, params.record);
    }

    onRouterVerb() {
        return 'GET';
    }

    onRouterPath() {
        return '/api/data/:object/:record';
    }
}