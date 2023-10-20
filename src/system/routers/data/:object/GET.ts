import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

export default class extends Router {
    constructor() { 
        super(__filename);
    }

    async run({ kernel, params, body }: RouterInit) {
        return kernel.data.selectAny(params.object, body);
    }
}