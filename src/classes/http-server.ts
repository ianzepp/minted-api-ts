import _ from 'lodash';
import Util from 'util';
import Http from 'http';
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
import Routers from '../preloads/routers';

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
            path: req.url,
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
            // Extract the search k=v data from the URL
            httpReq.search = new URL(req.headers.host + req.url).searchParams as _.Dictionary<any>;

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
            let system = new System({ id: System.UUIDZERO, ns: ['*'], sc: ['*'] });

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
            // Define the response
            let res_json =JSON.stringify(httpRes);

            // Return the response
            res.statusCode = httpRes.status;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Length', Buffer.byteLength(res_json, 'utf8').toString());
            res.write(res_json);
            return res.end();
        }
    }
}