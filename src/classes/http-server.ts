import _ from 'lodash';
import Util from 'util';
import Http from 'http';
import { pathToRegexp, match } from 'path-to-regexp';

// HTTP reqeuest body parsers
const textBody = Util.promisify(require('body'));
const jsonBody = Util.promisify(require('body/json'));
const formBody = Util.promisify(require('body/form'));

// Routers
import { HttpRouter } from './http-router';

// Heartbeat router
import { RouterHeartbeat } from '../routers/heartbeat';

// Test router
import { RouterTest } from '../routers/test';

// Data routers, single record
import { RouterDataCreateOne } from '../routers/data-create-one';
import { RouterDataSelectOne } from '../routers/data-select-one';
import { RouterDataUpdateOne } from '../routers/data-update-one';
import { RouterDataDeleteOne } from '../routers/data-delete-one';

// import DataCreateAll from './routers/data-create-all';
// import DataCreateOne from './routers/data-create-one';
// import DataDeleteAll from './routers/data-delete-all';
// import DataDeleteOne from './routers/data-delete-one';
// import DataSearchAll from './routers/data-search-all';
// import DataSelectAll from './routers/data-select-all';
// import DataSelectOne from './routers/data-select-one';
// import DataUpdateAll from './routers/data-update-all';
// import DataUpdateOne from './routers/data-update-one';
// import DataUpsertAll from './routers/data-upsert-all';

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
        this.use(RouterHeartbeat, 'GET', '/heartbeat');

        // Test router
        this.use(RouterTest, 'GET', '/api/test/:method/:glob');

        // Data routers
        this.use(RouterDataCreateOne, 'POST', '/api/data/:schema/new');
        this.use(RouterDataSelectOne, 'GET', '/api/data/:schema/:record');
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

            // Generate router instance
            let Router = server_route.router_type;
            let router = new Router(params, search, body);

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