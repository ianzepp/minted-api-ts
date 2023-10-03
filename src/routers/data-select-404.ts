import _ from 'lodash';

// API
import { Router } from '@classes/router';
import { UUID_REGEX } from '@classes/kernel';
import { ObjectType } from '@typedefs/object';

// Implementation
export default class extends Router {
    async run() {
        if (this.params.record.match(UUID_REGEX)) {
            return this.kernel.data.select404(this.params.object, this.params.record);
        }

        else if (this.params.record.includes('%')) {
            return this.kernel.data.search404(this.params.object, { where: { name: { $find: this.params.record }}});
        }

        else {
            return this.kernel.data.search404(this.params.object, { where: { name: this.params.record }});
        }
    }

    onHttpVerb() {
        return Router.Verb.Get;
    }

    onHttpPath() {
        return '/api/data/:object/:record';
    }
}