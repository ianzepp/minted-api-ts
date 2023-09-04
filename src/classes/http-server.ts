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

// Routers
import { HttpRouter } from './http-router';

// Import pre-loaded routers
import Routers from '../preloader/routers';
import { URLSearchParams } from 'url';

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
    // Track the router paths
    private readonly _routes: HttpServerRoute[] = [];

    // Start the server
    listen(port: number) {
        let server = Http.createServer((req, res) => {
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

        try {
            let request_url = new UrlParse(req.url, true);

            console.warn('Parsed URL', request_url);

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

            // Generate system, based on the logged in user for this request
            let system = new System({ id: System.RootId, ns: ['*'], sc: ['*'] });

            // Initialize the system
            await system.startup();

            // Run the router validation, followed by the implementation
            await system.knex.transaction(() => {
                return system.http.run(httpReq, httpRes);
            });
        }

        catch (error) {
            console.error('HttpServer: **ERROR**', error);

            httpRes.status = 500;
            httpRes.length = 0;
            httpRes.result = error;
        }

        finally {
            console.warn('httpReq.search', httpReq.search);

            if (httpReq.search.transform) {
                _.each(httpReq.search.transform.split(','), transform => {
                    let [tn, td] = transform.split('=');

                    if (tn === 'map') {
                        httpRes.result = _.map(httpRes.result, td);
                    }

                    if (tn === 'uniq') {
                        httpRes.result = _.uniq(httpRes.result);
                    }
                });
            }

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
}