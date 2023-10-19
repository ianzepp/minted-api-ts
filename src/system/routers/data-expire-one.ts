import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.expireOne(params.object, { id: params.record });
    }

    toName(): string {
        return 'system/routers/data-expire-one';
    }

    onRouterVerb() {
        return 'DELETE';
    }

    onRouterPath() {
        return '/api/data/:object/:record';
    }
}