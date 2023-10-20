import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    constructor() { 
        super(__filename);
    }

    async run({ kernel, params }: RouterInit) {
        return kernel.data.expire404(params.object, params.record);
    }
}