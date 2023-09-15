import _ from 'lodash';

// API
import { Router } from '@classes/router';
import { SchemaType } from '@typedefs/schema';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.search404(this.params.schema, { where: { name: this.params.record_name }});
    }

    onHttpVerb() {
        return Router.Verb.Get;
    }

    onHttpPath() {
        return '/api/meta/:schema/:record';
    }
}