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

// Ping router
import { RouterPing } from '../routers/ping';

// Test router
import { RouterTest } from '../routers/test';

// Data routers, single record
import { RouterDataCreateOne } from '../routers/data-create-one';
import { RouterDataSelectOne } from '../routers/data-select-one';
import { RouterDataSelectAll } from '../routers/data-select-all';
import { RouterDataUpdateOne } from '../routers/data-update-one';
import { RouterDataDeleteOne } from '../routers/data-delete-one';

export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';

export interface HttpServerRoute {
    method: HttpMethod;
    path: string;
    path_regexp: RegExp,
    router_type: typeof HttpRouter;
}

export class HttpServer {
    // Track the router paths
    private readonly _routes: HttpServerRoute[] = [];

    // Start the server
    listen(port: number) {
        console.warn('Starting http server..');

        // Heartbeat to check uptime
        this.use(RouterPing, 'GET', '/api/ping');

        // Test router
        this.use(RouterTest, 'GET', '/api/test/:method');

        // Data routers
        this.use(RouterDataCreateOne, 'POST', '/api/data/:schema/new');
        this.use(RouterDataSelectOne, 'GET', '/api/data/:schema/:record');
        this.use(RouterDataSelectAll, 'GET', '/api/data/:schema');
        this.use(RouterDataUpdateOne, 'PATCH', '/api/data/:schema/:record');
        this.use(RouterDataDeleteOne, 'DELETE', '/api/data/:schema/:record');

        // Create the listening server
        let server = Http.createServer((req, res) => this.run(req, res));
        server.setTimeout(1000);
        server.listen(port, () => {
            console.warn('HttpServer: started server %j', server.address());
        });

        // Done
    }

    use(router_type: typeof HttpRouter, method: HttpMethod, path: string) {
        this._routes.push({
            method: method,
            path: path,
            path_regexp: pathToRegexp(path),
            router_type: router_type,
        });

        console.debug('HttpServer: added route: %s %s', method, path);
    }


    async run(req: Http.IncomingMessage, res: Http.ServerResponse) {
        try {
            // Find the first matching route
            let server_route = _.find(this._routes, server_route => {
                return server_route.method === req.method
                    && server_route.path_regexp.exec(req.url ?? '/') !== null;
            });

            if (server_route === undefined) {
                res.statusCode = 404;
                return res.end();
            }

            // Extract params
            let params_url = new URL('http://localhost' + req.url);
            let params_match = match(server_route.path)(params_url.pathname);
            let params = _.get(params_match, 'params');

            // Extract search
            let search = params_url.searchParams as _.Dictionary<any>;

            // Extract body data
            let body = null;
            let content_type = (req.headers['content-type'] || '').split(';');

            if (content_type.includes('application/json')) {
                body = await jsonBody(req, res);
            }

            if (content_type.includes('text/plain')) {
                body = await textBody(req, res);
            }

            if (content_type.includes('multipart/form-data')) {
                body = await formBody(req, res);
            }

            // Log it
            console.warn('HttpRouter: %j %j', params_url.href, params);

            // Generate system, based on the logged in user for this request
            // TODO - for now assume root
            let system = new System({ id: System.UUIDZERO, ns: ['*'], sc: ['*'] });

            // Generate router instance
            let Router = server_route.router_type;
            let router = new Router(system, params, search, body);

            // Execute the router
            let result = await router.runsafe();
            let result_json = JSON.stringify(result);

            // Return the data
            res.statusCode = result.status;
            res.write(result_json);
            return res.end();
        }

        catch (error) {
            console.error('FATAL REQUEST ERROR!');
            console.error(error);

            res.statusCode = 500;
            return res.end();
        }
    }
}