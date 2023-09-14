import _ from 'lodash';
import chai from 'chai';
import { pathToRegexp, match } from 'path-to-regexp';

// Classes
import { Kernel } from '@classes/kernel';

// Typedefs
import { HttpReq } from '@typedefs/http-req';
import { HttpRes } from '@typedefs/http-res';
import { HttpVerb } from '@typedefs/http-verb';

// Helper to assert a value is not undefined
function assert<T>(v: T | undefined): T {
    chai.assert(v); return v;
}

export class Router {
    // Re-export aliases
    public static Verb = HttpVerb;

    private __kernel: Kernel | undefined;
    private __req: HttpReq | undefined;
    private __res: HttpRes | undefined;

    get kernel(): Kernel {
        return assert<Kernel>(this.__kernel);
    }

    get req(): HttpReq {
        return assert<HttpReq>(this.__req);
    }

    get res(): HttpRes {
        return assert<HttpRes>(this.__res);
    }

    get params(): _.Dictionary<string> {
        return this.req.params;
    }

    get search(): _.Dictionary<string> {
        return this.req.search;
    }

    async runsafe(kernel: Kernel, req: HttpReq, res: HttpRes): Promise<any> {
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
        this.__req.params = _.get(match(this.onHttpPath())(req.path), 'params');

        // Done
        return this.run();
    }

    async run(): Promise<any> {
        throw 'Unimplemented!';
    }

    toName(): string {
        return '<unknown>';
    }

    onHttpVerb(): string {
        throw 'Unimplemented!';
    }

    onHttpPath(): string {
        throw 'Unimplemented!';
    }

    isHttpVerb(verb: string): boolean {
        return verb == this.onHttpVerb();
    }

    isHttpPath(path: string): boolean {
        return pathToRegexp(this.onHttpPath()).exec(path ?? '/') !== null;
    }

    is(verb: string, path: string): boolean {
        return this.isHttpVerb(verb) && this.isHttpPath(path);
    }
}