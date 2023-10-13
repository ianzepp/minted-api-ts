import _ from 'lodash';
import chai from 'chai';
import { pathToRegexp, match } from 'path-to-regexp';

// Classes
import { Kernel } from '@system/kernels/kernel';

// Typedefs
import { RouterReq } from '@system/typedefs/router-req';
import { RouterRes } from '@system/typedefs/router-res';
import { RouterVerb } from '@system/typedefs/http-verb';

// Helper to assert a value is not undefined
function assert<T>(v: T | undefined, message?: string): T {
    chai.assert(v, message); return v;
}

export class Router {
    // Re-export aliases
    public static Verb = RouterVerb;

    private __kernel: Kernel | undefined;
    private __req: RouterReq | undefined;
    private __res: RouterRes | undefined;

    get kernel(): Kernel {
        return assert<Kernel>(this.__kernel, '"Router.__kernel" is undefined');
    }

    get req(): RouterReq {
        return assert<RouterReq>(this.__req, '"Router.__req" is undefined');
    }

    get res(): RouterRes {
        return assert<RouterRes>(this.__res, '"Router.__res" is undefined');
    }

    get params(): _.Dictionary<string> {
        return this.req.params;
    }

    get search(): _.Dictionary<string> {
        return this.req.search;
    }

    async runsafe(kernel: Kernel, req: RouterReq, res: RouterRes): Promise<any> {
        // Default body values
        if (req.verb == Router.Verb.Get) {
            req.body = req.body || {};
        }

        else if (req.verb == Router.Verb.Delete) {
            req.body = req.body || [];
        }

        else if (req.verb == Router.Verb.Patch) {
            req.body = req.body || [];
        }

        else if (req.verb == Router.Verb.Post) {
            req.body = req.body || [];
        }

        else if (req.verb == Router.Verb.Put) {
            req.body = req.body || [];
        }

        // Import references
        this.__kernel = kernel;
        this.__req = req;
        this.__res = res;

        // Set the params
        this.__req.params = _.get(match(this.onRouterPath())(req.path), 'params');

        console.warn(this.onRouterVerb(), this.onRouterPath());
        console.warn();

        // Done
        return this.run();
    }

    async run(): Promise<any> {
        throw 'Unimplemented!';
    }

    toName(): string {
        return '<unknown>';
    }

    onRouterVerb(): string {
        throw 'Unimplemented!';
    }

    onRouterPath(): string {
        throw 'Unimplemented!';
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