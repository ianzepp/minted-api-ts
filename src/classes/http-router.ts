import _ from 'lodash';
import chai from 'chai';
import { pathToRegexp, match } from 'path-to-regexp';

// Classes
import { HttpReq } from '../classes/http-server';
import { HttpRes } from '../classes/http-server';
import { System } from '../classes/system';

// Helper to assert a value is not undefined
function assert<T>(v: T | undefined) {
    chai.assert(v); return v;
}

export enum HttpVerb {
    Delete = 'DELETE',
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
    Put = 'PUT',
}

export class HttpRouter {
    // Re-export aliases
    public static Verb = HttpVerb;

    private _system: System | undefined;
    private _req: HttpReq | undefined;
    private _res: HttpRes | undefined;

    get system() {
        return assert<System>(this._system);
    }

    get req() {
        return assert<HttpReq>(this._req);
    }

    get res() {
        return assert<HttpRes>(this._res);
    }

    async runsafe(system: System, req: HttpReq, res: HttpRes) {
        // Default body values
        if (['GET'].includes(req.verb)) {
            req.body = req.body || {};
        }

        if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.verb)) {
            req.body = req.body || [];
        }

        // Import references
        this._system = system;
        this._req = req;
        this._res = res;

        // Set the params
        this._req.params = _.get(match(this.onHttpPath())(req.path), 'params');

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
        return verb === this.onHttpVerb();
    }

    isHttpPath(path: string): boolean {
        return pathToRegexp(this.onHttpPath()).exec(path ?? '/') !== null;
    }

    is(verb: string, path: string) {
        return this.isHttpVerb(verb) && this.isHttpPath(path);
    }
}