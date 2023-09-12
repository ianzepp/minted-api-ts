import _ from 'lodash';
import Util from 'util';
import Http from 'http';
import UrlParse from 'url-parse';

import { pathToRegexp, match } from 'path-to-regexp';

// HTTP reqeuest body parsers
const textBody = Util.promisify(require('body'));
const jsonBody = Util.promisify(require('body/json'));
const formBody = Util.promisify(require('body/form'));

// Classes
import { HttpReq } from '@classes/http-req';
import { HttpRes } from '@classes/http-res';
import { System } from '@classes/system';
import { SystemAsCors } from '@classes/system';

// Error
export class HttpError extends Error {};
export class HttpRouteNotFoundError extends HttpError {};

// Import pre-loaded routers
import HttpRouters from '@preloader/routers';

export class HttpServer {
    // Start the server
    listen(port: number): void {
        let server = Http.createServer((req, res) => {
            // @ts-ignore FIXME
            return this.run(req, res); // This is internally wrapped in a try/catch/finally
        });

        // List for connections
        server.listen(port, () => {
            console.warn('HttpServer: started server %j', server.address());
        });

        // Done
    }

    async run(req: Http.IncomingMessage, res: Http.ServerResponse) {
        console.debug('HttpServer:', req.method, req.url);

        // Build the structures of httpReq and httpRes to be passed into system-http
        let httpReq: HttpReq = {
            verb: req.method,
            path: undefined,
            params: undefined, // will be set once the matching router is found
            search: undefined,
            body: null,
        };

        let httpRes: HttpRes = {
            status: 0,
            length: 0,
            schema: undefined,
            record: undefined,
            filter: undefined,
            result: undefined,
        }

        // Process URL data
        let request_url = new UrlParse(req.url, true);

        // Extract the search k=v data from the URL
        httpReq.path = request_url.pathname;
        httpReq.search = request_url.query;
        httpRes.filter = request_url.query;

        // Always send CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Is this an OPTIONS request? All they want is CORS info..
        if (req.method === 'OPTIONS') {
            return res.end();
        }

        // Find a router that matches the request
        let router = _.find(HttpRouters, router => router.is(httpReq.verb, httpReq.path));

        if (router === undefined) {
            res.statusCode = 404;
            res.setHeader('Content-Length', 0);
            return res.end();
        }

        // Process the request
        let system = new SystemAsCors(req.headers.authorization);

        // Authenticate the user in a lightweight fashion before we go too far
        await system.authenticate();

        // Extract the body data
        let content_type = (req.headers['content-type'] || '').split(';');

        if (content_type.includes('application/json')) {
            httpReq.body = await jsonBody(req, res);
        }

        if (content_type.includes('text/plain')) {
            httpReq.body = await textBody(req, res);
        }

        if (content_type.includes('multipart/form-data')) {
            httpReq.body = await formBody(req, res);
        }

        // Run the router
        await new SystemAsCors().run(async system => {
            try {
                let result = await router.runsafe(system, httpReq, httpRes);

                if (result === undefined) {
                    result = null;
                }
        
                // Save the results
                httpRes.status = 200;
                httpRes.length = _.isArray(result) ? _.size(result) : 1;
                httpRes.result = result;
            }

            catch (error) {
                if (typeof error === 'string') {
                    httpRes.status = 500;
                    httpRes.result = error;
                }
                else if (error instanceof Error) {
                    httpRes.status = 500;
                    httpRes.result = error.name + ': ' + error.message;
                }

                else {
                    httpRes.status = 500;
                    httpRes.result = error;
                }

                // Always set the length to 0
                httpRes.length = 0;
            }
        });

        // JSON-ify the result
        let res_json = JSON.stringify(httpRes);

        // Return the response
        res.statusCode = httpRes.status;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', Buffer.byteLength(res_json, 'utf8').toString());
        res.write(res_json);
        return res.end();
    }
}