import _ from 'lodash';

// API
import { HttpRouter } from '../classes/http-router';

// Implementation
export class RouterMetaImport extends HttpRouter {
    async run() {
        return this.system.meta.import(this.body);
    }

    onHttpPath() {
        return '/api/meta/import';
    }

    onHttpVerb() {
        return 'PUT';
    }
}