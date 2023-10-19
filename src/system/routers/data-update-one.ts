import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.updateOne(params.object, body);
    }

    toName(): string {
        return 'system/routers/data-update-one';
    }

    onRouterVerb() {
        return 'PATCH';
    }

    onRouterPath() {
        return '/api/data/:object/:record';
    }
}