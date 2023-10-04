import _ from 'lodash';
import UrlParse from 'url-parse';

// Classes
import { RouterReq } from '@typedefs/router-req';
import { RouterRes } from '@typedefs/router-res';
import { Kernel } from '@classes/kernel';
import { toJSON } from '@classes/helper';

// Import pre-loaded routers
import Routers from '@loaders/routers';

// Error
export class HttpError extends Error {};
export class HttpRouteNotFoundError extends HttpError {};

function newResponse(data?: any) {
    let res = new Response(data);

    // Always send CORS headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    res.headers.set('Access-Control-Allow-Credentials', 'true');

    // Done
    return res;
}

export class Server {
    async route(req: Request) {
        // Process URL data
        let request_url = new UrlParse(req.url, true);

        // Build the structures of httpReq and httpRes to be passed into kernel-http
        let httpReq: RouterReq = {
            verb: req.method,
            path: request_url.pathname,
            params: undefined, // will be set once the matching router is found
            search: request_url.query,
            body: null,
        };

        let httpRes: RouterRes = {
            status: 0,
            length: 0,
            object: undefined,
            record: undefined,
            filter: request_url.query,
            result: undefined,
        }

        // Is this an OPTIONS request? All they want is CORS info..
        if (req.method === 'OPTIONS') {
            return newResponse();
        }

        // Find a router that matches the request
        let router = _.find(Routers, router => router.is(httpReq.verb, httpReq.path));

        if (router === undefined) {
            throw new HttpRouteNotFoundError(req.url);
        }

        // Extract the body data
        let content_type = (req.headers.get('Content-Type') || '').split(';');

        if (content_type.includes('application/json')) {
            httpReq.body = await req.json();
        }

        if (content_type.includes('text/plain')) {
            httpReq.body = await req.text();
        }

        if (content_type.includes('multipart/form-data')) {
            httpReq.body = await req.formData();;
        }

        // Run the router
        let kernel = new Kernel(Kernel.ID, Kernel.NS);

        try {
            // Startup the kernel
            await kernel.startup();

            // Startup a transaction
            await kernel.data.transaction();

            // Start a transaction

            let result = await router.runsafe(kernel, httpReq, httpRes);

            if (result === undefined) {
                result = null;
            }

            // Convert to JSON
            result = toJSON(result);

            // Save the results
            httpRes.status = 200;
            httpRes.length = _.isArray(result) ? _.size(result) : 1;
            httpRes.result = result;

            // Commit the transaction
            await kernel.data.commit();
        }

        catch (error) {
            // Revert the transaction
            await kernel.data.revert();

            // Cleanup any misc data
            await kernel.cleanup();

            // Process the result
            if (typeof error === 'string') {
                httpRes.status = 500;
                httpRes.result = error;
            }
            else if (error instanceof Error) {
                httpRes.status = 500;
                httpRes.result = 'error: ' + error.message;
            }

            else {
                httpRes.status = 500;
                httpRes.result = error;
            }

            // Always set the length to 0
            httpRes.length = 0;
        }

        // Return the response
        return newResponse(JSON.stringify(httpRes));
    }
}