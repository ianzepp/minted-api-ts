import _ from 'lodash';

// Classes
import { System } from './system';

// API
export interface RouterResult {
    method: string | undefined,
    path: string | undefined,
    code: number,
    data: any
}

export interface HttpRouterResult {
    code: number;
    text: string | null;
    data: any;
}

export class HttpRouter {
    readonly system = new System();

    constructor(
        readonly params: _.Dictionary<string>,
        readonly search: _.Dictionary<string>,
        readonly body: any) {}

    async runsafe() {
        let result: HttpRouterResult = {
            code: 0,
            text: null,
            data: null,
        }

        try {
            // // Run the router validation, followed by the implementation
            // let data = await this.system.knex.transact(() => this.run());

            // Save the results
            result.code = 200;
            result.data = { status: "unprocessed" };
        }

        catch (error) {
            // Save the result error
            result.code = error.code || 500;
            result.text = error.message;
        }

        return result;
    }

    async run(): Promise<any> {
        // no default implementation
    }

    //
    // Private helpers
    //

    // private _parse_url() {
    //     return new URL('http://localhost' + this.req.url);
    // }
    //
    // private _to_params(): _.Dictionary<any> {
    //     return _.get(match(this.onRouterPath())(this._parse_url().pathname), 'params') || {};
    // }
    //
    // private _to_search(): _.Dictionary<any> {
    //     return this._parse_url().searchParams;
    // }
    //
    // private _to_change(): Array<_.Dictionary<any>> {
    //     return []; // TODO - implement body data
    // }
}