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
    status: number;
    schema: string | undefined;
    record: string | undefined;
    result: any;
}

export class HttpRouter {
    readonly system = new System();

    constructor(
        readonly params: _.Dictionary<string>,
        readonly search: _.Dictionary<string>,
        readonly body: any) {}

    async runsafe() {
        let result: HttpRouterResult = {
            status: 0,
            schema: this.params.schema,
            record: this.params.record,
            result: undefined,
        }

        try {
            // Initialize the system
            await this.system.startup();

            // Authentication
            await this.system.authenticate();

            // Run the router validation, followed by the implementation
            let data = await this.system.knex.transaction(() => this.run());

            if (data === undefined) {
                data = null;
            }

            // Save the results
            result.status = 200;
            result.result = data;
        }

        catch (error) {
            console.warn('HttpRouter#Error:', error);

            // Save the result error
            result.status = error.code || 500;
            result.result = JSON.stringify(error);
        }

        return result;
    }

    async run(): Promise<any> {
        throw new Error('No default implementation!');
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