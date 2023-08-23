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

        // // Data API - Searches
        // this.use(DataSearchAll, 'POST', '/api/data/:schema/search');

        // // Data API - Record-level operations
        // this.use(DataCreateOne, 'POST', '/api/data/:schema/new');
        // this.use(DataSelectOne, 'GET', '/api/data/:schema/:record');
        // this.use(DataUpdateOne, 'PATCH', '/api/data/:schema/:record');
        // this.use(DataDeleteOne, 'DELETE', '/api/data/:schema/:record');

        // // Data API - Schema-level operationrs
        // this.use(DataSelectAll, 'GET', '/api/data/:schema');
        // this.use(DataCreateAll, 'POST', '/api/data/:schema');
        // this.use(DataUpsertAll, 'PUT', '/api/data/:schema');
        // this.use(DataUpdateAll, 'PATCH', '/api/data/:schema');
        // this.use(DataDeleteAll, 'DELETE', '/api/data/:schema');

        // Create the listening server
        let server = Http.createServer((req, res) => this.run(req, res));
        server.setTimeout(1000);
        server.listen(port);

        // Done
    }

    use(router_type: typeof HttpRouter, method: HttpMethod, path: string) {
        this._routes.push({
            method: method,
            path: path,
            path_regexp: pathToRegexp(path),
            router_type: router_type,
        });
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

            // console.warn('params_url', params_url);
            // console.warn('params_match', params_match);
            // console.warn('search', params_url.searchParams);
            // console.warn('headers', req.headers);

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
            res.statusCode = result.code;
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