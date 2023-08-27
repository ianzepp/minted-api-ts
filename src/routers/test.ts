import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export class RouterTest extends HttpRouter {
    async run() {
        let method = this.params.method;

        if (method === 'select') {
            return this.testSelect();
        }

        if (method === 'create') {
            return this.testCreate();
        }

        throw 'Invalid test method name';
    }

    async testSelect() {
        return this.system.data.select404('schema', {
            limit: 1
        });
    }

    async testCreate() {
        return this.system.data.createOne('schema', {
            type: 'schema',
            data: {
                name: 'Test: ' + this.params.glob,
                description: 'Something to test'
            }
        });
    }
}