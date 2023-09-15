import _ from 'lodash';

// API
import { Router } from '@classes/router';
import { UUID_REGEX } from '@classes/kernel';
import { SchemaType } from '@typedefs/schema';

// Implementation
export default class extends Router {
    async run() {
        if (this.params.record.match(UUID_REGEX)) {
            return this.kernel.data.select404(this.params.schema, this.params.record);
        }

        else if (this.params.record.includes('%')) {
            return this.kernel.data.search404(this.params.schema, { where: { name: { $find: this.params.record }}});
        }

        else {
            return this.kernel.data.search404(this.params.schema, { where: { name: this.params.record }});
        }
    }

    onHttpVerb() {
        return Router.Verb.Get;
    }

    onHttpPath() {
        return '/api/data/:schema/:record';
    }
}