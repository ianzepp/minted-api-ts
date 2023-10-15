import _ from 'lodash';
import chai from 'chai';
import { pathToRegexp, match } from 'path-to-regexp';
import UrlParse from 'url-parse';

// Classes
import { Kernel } from '@system/kernels/kernel';
import { ResponseCORS } from '@system/classes/response-cors';
import { ResponseStatusText } from '@system/classes/response-status-text';

export interface RouterInit {
    kernel: Kernel,
    params: _.Dictionary<string>;
    search: _.Dictionary<string>;
    body: any;
}

export class Router {
    async try(kernel: Kernel, req: Request, body: any): Promise<Response> {
        let result_code: number;
        let result_data: any;
        let result_type: string = this.toContentType();

        console.warn('router.try():', req.method, req.url);

        // Start processing
        try {
            // Parse the URL
            let url = new UrlParse(req.url, true);

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
            result_data = await this.run(config);
            result_code = 200;

            // Commit or revert the transaction?
            await kernel.knex.commit();
        }

        catch (error) {
            // Rollback the transaction
            await kernel.knex.revert();

            // Set the error response
            result_data = { error: error.stack || error.message || error };
            result_code = 500;

            // Testing?
            console.error(result_data.error);
        }

        finally {
            // Cleanup if needed
            await kernel.cleanup();
        }

        // Stringify the response data?
        try {
            if (result_type === 'application/json') {
                result_data = JSON.stringify(result_data);
            }
        }

        catch (error) {
            result_data = 'Error when executing "JSON.stringify" on the original response. Error details: ' + error;
            result_code = 500;
            result_type = 'text/plain';
        }

        // Return
        return new ResponseCORS(JSON.stringify(result_data), {
            status: result_code,
            statusText: ResponseStatusText[result_code],
            headers: { 'Content-Type': result_type }
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