import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';
import { OpenApi } from '../../classes/openapi';

export default class extends Router {
    constructor() { 
        super(__filename);
    }

    async run({ kernel }: RouterInit) {
        return new OpenApi(kernel).describe();
    }
}