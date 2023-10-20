import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

// Implementation
export default class extends Router {
    constructor() { 
        super(__filename);
    }

    async run({ kernel, params, body }: RouterInit) {    
        if (body === undefined) {
            throw new Error('Request body is missing');
        }
        
        if (_.isEmpty(body)) {
            throw new Error('Request body is empty');
        }

        if (_.isArrayLike(body)) {
            return kernel.data.createAll(params.object, body);
        }

        if (_.isPlainObject(body)) {
            return kernel.data.createOne(params.object, body);
        }

        throw new Error(`Unsupport request body type "${ typeof body }"`);
    }
}