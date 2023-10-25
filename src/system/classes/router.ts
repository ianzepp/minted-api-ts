import _ from 'lodash';
import Debug from 'debug';
import path from 'path';
import { pathToRegexp, match } from 'path-to-regexp';
import UrlParse from 'url-parse';

// Classes
import { Kernel } from '@kernel/classes/kernel';
import { Preloader } from '@system/classes/preloader';
import { ResponseCORS } from './response-cors';

// Create debugger
const debug = Debug('minted:system:router');

// Preload the routers
export const Routers = Preloader.from<Router>('./src/*/routers/**/*.ts');

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
    // What is the API path prefix
    public static ROUTER_PATH_PREFIX = '/api/';

    // Store the router params as derived from the constructor
    public readonly router_file: string;
    public readonly router_verb: string;
    public readonly router_path: string;
    public readonly router_path_regexp: RegExp;

    // Protected constructor
    protected constructor(private readonly filename = __filename) {
        // Normalize path to use forward slashes
        let normalizedPath = path.normalize(filename).replace(/\\/g, '/');

        // Use a regular expression to extract the <path> portion
        let match = normalizedPath.match(/\/src\/.*?\/routers\/(.*)/);

        if (match === null) {
            debug('Router implementation is outside of the expected filename pattern!');
            return;
        }

        // If a match was found, extract the <path> portion, otherwise use an empty string
        this.router_file = match[1];

        // Assign the filename path (without the extension) to the router_verb variable
        this.router_verb = path.basename(this.router_file, path.extname(this.router_file));

        // Assign the path portion (without trailing directory slashes) to the router_path variable
        this.router_path = Router.ROUTER_PATH_PREFIX + path.dirname(this.router_file);
        this.router_path_regexp = pathToRegexp(this.router_path);

        debug('router:', filename);
        debug('- router_verb', this.router_verb);
        debug('- router_path', this.router_path);
     }

    // Route a request
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
                throw new RouterError(404, `Unroutable request "${ req.method } ${ router_url.pathname }"`);
            }

            // Process the router params
            router_init.params = _.get(match(router.router_path)(router_url.pathname), 'params') || {};
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

            // Did the router return a raw Response object?
            if (result instanceof Response) {
                return result;
            }

            // Process as a normal API response
            router_done.status = 'ok';
            router_done.hrtime = process.hrtime(hrtime);
            router_done.result = result;
            router_done.errors = undefined;

            // Done
            return ResponseCORS.from(200, router_done);
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
            router_done.hrtime = process.hrtime(hrtime);
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

            // Done
            return ResponseCORS.from(200, router_done);
        }
    }

    async try(req: Request, router_init: RouterInit) {
        debug('router.try() "%s %s" with params=%j search=%j', this.router_verb, this.router_path, router_init.params, router_init.search);

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
        debug('router.try(): with router:', this.filename);
        return this.run(router_init);
    }

    async run(router_init: RouterInit) {
        return undefined;
    }

    is(verb: string, path: string = '/'): boolean {
        debug('is() testing:', verb, path, 'vs', this.router_verb, this.router_path);
        return verb == this.router_verb && this.router_path_regexp.exec(path) !== null;
    }
}