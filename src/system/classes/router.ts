import _ from 'lodash';
import Debug from 'debug';
import { pathToRegexp, match } from 'path-to-regexp';
import UrlParse from 'url-parse';

// Classes
import { Kernel } from '@system/kernels/kernel';
import { Preloader } from '@system/classes/preloader';
import { ResponseCORS } from './response-cors';
import { ResponseStatusText } from './response-status-text';

// Create debugger
const debug = Debug('minted:system:router');

// Preload the routers
export const Routers = Preloader.from<Router>('./src/*/routers/*.ts');

export class RouterError extends Error {
    public readonly errors: string[] = [];

    constructor(public readonly code: number, public readonly message: string) {
        super(message);
    }
}

export interface RouterInit {
    kernel: Kernel;
    params: _.Dictionary<string>;
    search: _.Dictionary<string>;
    body: any;
}

export interface RouterEnvelope {
    status: 'ok' | 'errors';
    hrtime: [number, number];
    result?: any
    errors?: any;
}

export class Router {
    public static async route(req: Request): Promise<Response> {
        // Setup
        let kernel = new Kernel();
        let result: any;

        // Setup interfaces
        let router_init: RouterInit = {
            kernel: kernel,
            params: {},
            search: {},
            body: undefined,
        }

        let router_done: RouterEnvelope = {
            status: undefined,
            hrtime: undefined,
            result: undefined,
            errors: undefined,
        };

        // Track hrtime
        let hrtime = process.hrtime();

        // Start processing
        try {
            debug('processing', req.method, req.url);

            // Find and execute the right router. 
            let router_url = new UrlParse(req.url, true);
            let router = Routers.find(r => r.is(req.method, router_url.pathname));

            // No router matches?
            if (router === undefined) {
                throw new RouterError(404, `Unroutable request "${ req.method } ${ router_url.pathname }`);
            }

            // Process the router params
            router_init.params = _.get(match(router.onRouterPath())(router_url.pathname), 'params') || {};
            router_init.search = router_url.query;

            // Startup the kernel
            await kernel.startup();

            // Start a transaction
            await kernel.knex.transaction();

            // Run
            let result = await router.try(req, router_init);

            // Commit the transaction
            await kernel.knex.commit();

            // Cleanup
            await kernel.cleanup();

            // Set the response
            router_done.status = 'ok';
            router_done.result = result;
            router_done.errors = undefined;
        }

        catch (error: any) {
            // Rollback the transaction
            await kernel.knex.rollback();

            // Cleanup
            await kernel.cleanup();

            // Set the response
            router_done.result = result;

            // Handle
            router_done.status = 'errors';
            router_done.result = undefined;
            router_done.errors = [];

            if (error instanceof RouterError) {
                router_done.errors.push(error.stack || error.message, ... error.errors);
            }

            else if (error instanceof Error) {
                router_done.errors.push(error.stack || error.message);
            }

            else {
                router_done.errors.push(error.stack || error);
            }
        }

        finally {
            router_done.hrtime = process.hrtime(hrtime);
        }

        // Done
        return ResponseCORS.from(200, router_done);
    }

    async try(req: Request, router_init: RouterInit) {
        debug('router.try() "%s %s" with params=%j search=%j', this.onRouterVerb(), this.onRouterPath(), router_init.params, router_init.search);

        // Redirect content type processing failures
        // Extract the body data
        try {
            // Process the request body
            let content_type = (req.headers.get('Content-Type') || '').toLowerCase();
            debug('router.try(): with content type "%s"', content_type);

            if (req.method === 'GET' && content_type) {
                throw new Error('Request "Content-Type" header should not be included for a "GET" request');
            }

            else if (req.method === 'GET') {
                // nothing to do
            }

            else if (content_type === '') {
                throw new Error('Request "Content-Type" header is required but missing');
            }

            else if (content_type === 'application/json') {
                router_init.body = await req.json();
            }

            else if (content_type === 'text/plain') {
                router_init.body = await req.text();
            }

            else if (content_type === 'multipart/form-data') {
                router_init.body = await req.formData();
            }
        }

        catch (error) {
            debug('router.try(): failed to extract the request body:', error.message);
            throw new Error('Unable to process the request body: ' + error.message);
        }

        // Try to process the router
        debug('router.try(): with body data length', (router_init.body || '').length);
        debug('router.try(): with router:', this.toName());
        return this.run(router_init);
    }

    async run(router_init: RouterInit) {
        return undefined;
    }

    toName(): string {
        return '';
    }

    toContentType() {
        return 'application/json';
    }

    onRouterVerb(): string {
        return '';
    }

    onRouterPath(): string {
        return '';
    }

    isRouterVerb(verb: string): boolean {
        return verb == this.onRouterVerb();
    }

    isRouterPath(path: string): boolean {
        return pathToRegexp(this.onRouterPath()).exec(path ?? '/') !== null;
    }

    is(verb: string, path: string): boolean {
        return this.isRouterVerb(verb) && this.isRouterPath(path);
    }
}