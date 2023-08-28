import _ from 'lodash';
import { pathToRegexp, match } from 'path-to-regexp';

// Classes
import { System } from '../classes/system';

// API
export interface RouterResult {
    method: string | undefined,
    path: string | undefined,
    code: number,
    data: any
}

export interface HttpRouterResult {
    status: number;
    length: number;
    schema: string | undefined;
    record: string | undefined;
    result: any;
}

export class HttpRouter {
    constructor(
        readonly system: System,
        readonly params: _.Dictionary<string>,
        readonly search: _.Dictionary<string>,
        readonly body: any) {}

    async runsafe() {
        let result: HttpRouterResult = {
            status: 0,
            length: 0,
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
            result.length = _.isArray(data) ? _.size(data) : 1;
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
        throw 'Unimplemented!';
    }

    onHttpVerb(): string {
        throw 'Unimplemented!';
    }

    onHttpPath(): string {
        throw 'Unimplemented!';
    }

    onHttpPathRegexp(): RegExp {
        return pathToRegexp(this.onHttpPath());
    }
}