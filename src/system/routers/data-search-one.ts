import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.searchOne(params.object, { id: params.record });
    }

    toName(): string {
        return 'system/routers/data-search-one';
    }

    onRouterVerb() {
        return 'GET';
    }

    onRouterPath() {
        return '/api/data/:object/:record';
    }
}