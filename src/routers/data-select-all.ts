import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export class RouterDataSelectAll extends HttpRouter {
    async run() {
        return this.system.data.selectAll(this.params.schema, {});
    }
}