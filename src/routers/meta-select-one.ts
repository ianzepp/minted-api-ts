import _ from 'lodash';

// API
import { Router } from '@classes/router';
import { ObjectType } from '@typedefs/object';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.search404(this.params.object, { name: this.params.record_name });
    }

    onRouterVerb() {
        return Router.Verb.Get;
    }

    onRouterPath() {
        return '/api/meta/:object/:record';
    }
}