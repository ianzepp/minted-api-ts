import _ from 'lodash';

// API
import { Router } from '@classes/router';
import { ObjectType } from '@typedefs/object';

// Implementation
export default class extends Router {
    async run() {
        return this.kernel.data.search404(this.params.object, { where: { name: this.params.record_name }});
    }

    onRouterVerb() {
        return Router.Verb.Get;
    }

    onHttpPath() {
        return '/api/meta/:object/:record';
    }
}