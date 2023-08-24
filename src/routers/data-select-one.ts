import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export class RouterDataSelectOne extends HttpRouter {
    async run() {
        return this.system.data.select404(this.params.schema, {
            limit: 1,
            where: {
                id: this.params.record
            }
        });
    }
}