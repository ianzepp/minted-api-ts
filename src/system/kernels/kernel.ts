import _ from 'lodash';
import util from 'util';
import chai from 'chai';

// UUID is a common requirement
import { v4 as uuid } from 'uuid';

// Classes
import { KernelBulk } from '@system/kernels/kernel-bulk';
import { KernelChat } from '@system/kernels/kernel-chat';
import { KernelKnex } from '@system/kernels/kernel-knex';
import { KernelData } from '@system/kernels/kernel-data';
import { KernelMeta } from '@system/kernels/kernel-meta';
import { KernelUser } from '@system/kernels/kernel-user';
import { KernelSmtp } from '@system/kernels/kernel-smtp';

// Preloader
import { Action } from '@system/classes/action';
import { Router } from '@system/classes/router';
import { Preloader } from '@system/classes/preloader';
import { ResponseCORS } from '../classes/response-cors';

export const KernelActions = Preloader.from<Action>('./src/*/actions/*.ts');
export const KernelRouters = Preloader.from<Router>('./src/*/routers/*.ts');

// Match UUIDs
export const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export class Kernel {
    // Import aliases
    public readonly uuid = uuid;
    public readonly expect = chai.expect;

    // General
    public static ID = '00000000-0000-0000-0000-000000000000';
    public static NS = 'system';

    // Services
    public readonly bulk = new KernelBulk(this);
    public readonly chat = new KernelChat(this);
    public readonly data = new KernelData(this);
    public readonly knex = new KernelKnex(this);
    public readonly meta = new KernelMeta(this);
    public readonly user = new KernelUser(this);
    public readonly smtp = new KernelSmtp(this);

    // Kernel constants
    public readonly time = new Date();

    // Sudo root
    private sudo_chain: string[] = [];

    //
    // Service Methods
    //

    async startup(): Promise<void> {
        // Knex has to load first
        await this.knex.startup();

        // Startup the rest
        await this.data.startup();
        await this.meta.startup();
        await this.user.startup();

        // These don't care
        await this.bulk.startup();
        await this.chat.startup();
        await this.smtp.startup();
    }

    async cleanup(): Promise<void> {
        // Shut down
        await this.bulk.cleanup();
        await this.chat.cleanup();
        await this.smtp.cleanup();

        await this.meta.cleanup();
        await this.data.cleanup();
        await this.user.cleanup();

        // Unload knex last
        await this.knex.cleanup();
    }

    async refresh(): Promise<void> {
        await this.cleanup();
        await this.startup();
    }

    //
    // Route an API request
    //

    async safe(promise: Promise<any>, defaultTo: any) {
    }

    async route(req: Request) {
        // Read the body data
        let request_type = (req.headers.get('Content-Type') || '').split(';');
        let request_body: any = undefined;

        try {
            if (req.method === 'GET') {
                // no body processing for GET requests
            }
            
            else if (request_type.includes('application/json')) {
                request_body = await req.json();
            }

            else if (request_type.includes('text/plain')) {
                request_body = await req.text();
            }

            else if (request_type.includes('multipart/form-data')) {
                request_body = await req.formData();
            }
        }

        catch (error) {
            console.error(error);

            if (error instanceof SyntaxError && req.method === 'GET') {
                return ResponseCORS.from(400, error.message + ': Did you include a "Content-Type" with a "GET" request?');
            }

            return ResponseCORS.from(400, error.message);
        }

        // 
        // Find and execute the right router. The `router.try()` method is already wrapped in
        // an internal try/catch block, so we should never have to handle an error here.
        //

        try {
            let router_url = new URL(req.url);
            let router = KernelRouters.find(r => r.is(req.method, router_url.pathname, request_body));

            // Router not found?
            if (router === undefined) {
                return ResponseCORS.from(404, router_url.pathname);
            }

            return router.try(this, req, request_body);
        }

        catch (error) {
            console.error('Error executing the selected router for:', req.method, req.url);
            console.error(error.stack || error);

            // Done
            return ResponseCORS.from(500, error.stack || error.message || error);
        }
    }

    //
    // Methods
    //

    isRoot(): boolean {
        return this.sudo_chain.length === 0 
            || this.sudo_chain[this.sudo_chain.length - 1] === Kernel.ID;
    }

    isNodeTest(): boolean {
        return Bun.env.NODE_ENV === 'test';
    } 

    isNodeProduction(): boolean {
        return Bun.env.NODE_ENV === 'production';
    }

    timeISO(): string {
        return this.time.toISOString();
    }


    //
    // User ID, NS, and namespaces
    //

    get user_id() {
        return Kernel.ID;
    }

    get user_ns() {
        return Kernel.NS;
    }

    get namespaces() {
        return _.uniq(_.compact(['system', this.user_ns]));
    }

    //
    //
    // Switch into or out of another user

    sudoRoot() {
        this.sudo_chain.push(Kernel.ID);
    }

    sudoUser(user_id: string) {
        this.sudo_chain.push(user_id);
    }

    sudoExit() {
        this.sudo_chain.pop();
    }

    //
    // Test helpers
    //

    toTestName() {
        return 'test_' + Math.floor(Math.random() * 1000000);
    }
}
