import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export class RouterMetaExport extends HttpRouter {
    async run() {
        return this.system.meta.export();
    }

    onHttpPath() {
        return '/api/meta/export';
    }

    onHttpVerb() {
        return 'GET';
    }
}