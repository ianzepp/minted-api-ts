import _ from 'lodash';

// API
import { Router, RouterInit } from '@system/classes/router';

/**
 * This router is used to fetch data with a predefined `system::filter`. 
 */
export default class extends Router {
    async run({ kernel, params, body }: RouterInit) {
        // Find the filter
        let filter = await kernel.data.select404('system::filter', params.record);

        // Return any records that match the filter criteria
        return kernel.data.selectAny(filter.data.object, filter.data.filter);
    }

    onRouterVerb() {
        return 'GET';
    }

    onRouterPath() {
        return '/api/find/:record';
    }
}