import _ from 'lodash';
import chai from 'chai';
import { pathToRegexp, match } from 'path-to-regexp';
import UrlParse from 'url-parse';

// Classes
import { Kernel } from '@system/kernels/kernel';
import { ResponseCORS } from '@system/classes/response-cors';
import { ResponseStatusText } from '@system/classes/response-status-text';
import { toJSON } from './helper';
import { RecordNotFoundError } from '../kernels/kernel-data';

export interface RouterInit {
    kernel: Kernel,
    params: _.Dictionary<string>;
    search: _.Dictionary<string>;
    body: any;
}

export interface RouterDone {
    code: number;
    body: any;
}

export class Router {
    async try(kernel: Kernel, req: Request, body: any): Promise<Response> {
        let router_done: RouterDone = {
            code: 0,
            body: null
        };

        // Parse the URL
        let url = new UrlParse(req.url, true);

        // console.warn('router.try():', req.method, req.url, url.query);

        // Start processing
        try {
            // Build the router runtime config
            let config = {
                kernel: kernel,
                params: _.get(match(this.onRouterPath())(url.pathname), 'params') || {},
                search: url.query || {},
                body: body,
            }

            // Startup the kernel
            await kernel.startup();

            // Startup a transaction
            await kernel.knex.transaction();

            // Run
            router_done.body = await this.run(config);
            router_done.code = 200;

            // Commit or revert the transaction?
            await kernel.knex.commit();
        }

        catch (error) {
            // Rollback the transaction
            await kernel.knex.revert();

            console.error(error);

            // Set the error response
            if (error instanceof Error && error.message && error.message.match(/^[0-9]{3}$/)) {
                router_done.code = parseInt(error.message); // 300, or 404, or 500, or ...
                router_done.body = error;
            }

            else {
                router_done.code = 500;
                router_done.body = error;
            }
        }

        finally {
            // Cleanup if needed
            await kernel.cleanup();
        }

        // Return
        return ResponseCORS.from(200, JSON.stringify(router_done), { 
            headers: { 'Content-Type': 'application/json' }
        });
}

    async run(config: RouterInit): Promise<any> {
        // No default implementation
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

    isRouterBody(body: unknown) {
        return true; // Default is to accept any type of body data
    }

    is(verb: string, path: string, body: unknown): boolean {
        return this.isRouterVerb(verb) && this.isRouterPath(path) && this.isRouterBody(body);
    }
}