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
import { System } from '../classes/system';
import { SystemAsCors } from '../classes/system';

// Routers
import { HttpRouter } from './http-router';

export interface HttpServerRoute {
    verb: string;
    path: string;
    path_regexp: RegExp,
    router_type: typeof HttpRouter;
}

export interface HttpReq {
    verb: string;
    path: string;
    params: _.Dictionary<string>;
    search: _.Dictionary<string>;
    body: any;
}

export interface HttpRes {
    status: number;
    length: number;
    schema: string | undefined;
    record: string | undefined;
    result: any;
}

export class HttpServer {
    // Start the server
    listen(port: number): void {
        let server = Http.createServer((req, res) => {
            // @ts-ignore
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
            result: undefined,
        }

        // Always send CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Is this an OPTIONS request? All they want is CORS info..
        if (req.method === 'OPTIONS') {
            return res.end();
        }

        // Process the request
        let system: System;

        // TODO Generate actual user creds from CORS
        system = new SystemAsCors(req.headers.cookie);

        // Authenticate the user before we go too far
        await system.authenticate();

        // Process URL data
        let request_url = new UrlParse(req.url, true);

        // Extract the search k=v data from the URL
        httpReq.path = request_url.pathname;
        httpReq.search = request_url.query;

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

        // Initialize the system
        await system.startup();

        // Run the router
        await system.http.run(httpReq, httpRes);

        // Cleanup
        await system.cleanup();

        // Define the response
        let res_json = JSON.stringify(httpRes);

        // Return the response
        res.statusCode = httpRes.status;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Length', Buffer.byteLength(res_json, 'utf8').toString());
        res.write(res_json);
        return res.end();
    }
}