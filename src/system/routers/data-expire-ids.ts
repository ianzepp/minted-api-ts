import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.expireIds(params.object, [params.record]);
    }

    onRouterVerb() {
        return 'DELETE';
    }

    onRouterPath() {
        return '/api/data/:object/:record';
    }
}