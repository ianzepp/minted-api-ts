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
import Routers from '../classes/routers';

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
            try {
                return this.run(req, res);
            }

            catch (error) {
                console.error('HttpServer: FATAL REQUEST ERROR!');
                console.error('HttpServer:', error);
    
                res.statusCode = 500;
                res.write(JSON.stringify({
                    status: 500,
                    length: 0,
                    result: error
                }));

                res.end();
            }
        });

        server.setTimeout(1000);
        server.listen(port, 'localhost', () => {
            console.warn('HttpServer: started server %j', server.address());
        });

        // Done
    }

    async run(req: Http.IncomingMessage, res: Http.ServerResponse) {
        console.warn('req.headers.host', req.headers.host);

        // Build the httpReq and httpRes to be passed into system-http
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

        // Return the response
        res.statusCode = httpRes.status;
        res.write(JSON.stringify(httpRes));
        return res.end();
    }
}