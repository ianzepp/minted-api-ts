import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    constructor() { 
        super(__filename);
    }

    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.update404(params.object, params.record, body);
    }
}