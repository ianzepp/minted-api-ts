import _ from 'lodash';
import chai from 'chai';
import fs from 'fs-extra';

// Classes
import { HttpReq } from '../classes/http-server';
import { HttpRes } from '../classes/http-server';
import { System } from '../classes/system';
import { SystemService } from '../classes/system';

// Import pre-loaded routers
import Routers from '../preloader/routers';

export class SystemHttp implements SystemService {
    constructor(private readonly system: System) {}

    async startup(): Promise<void> {}

    async cleanup(): Promise<void> {}

    async run(httpReq: HttpReq, httpRes: HttpRes): Promise<HttpRes> {
        // Find the first matching router
        let router = _.find(Routers, router => router.is(httpReq.verb, httpReq.path));

        if (router === undefined) {
            throw `Router not found: ${httpReq.path}`;
        }

        console.warn('SystemHttp: %s %j', router.onHttpVerb(), router.onHttpPath());

        // Run the router
        let data = await router.runsafe(this.system, httpReq, httpRes);

        if (data === undefined) {
            data = null;
        }

        // Save the results
        httpRes.status = 200;
        httpRes.length = _.isArray(data) ? _.size(data) : 1;
        httpRes.result = data;

        // Done
        return httpRes;
    }

    async transform(httpReq: HttpReq, httpRes: HttpRes) {
        // do nothing
    }
}