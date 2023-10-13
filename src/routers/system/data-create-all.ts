import _ from 'lodash';

// API
import { Router } from '@classes/router';
import { ChangeData } from '@typedefs/record';

// Implementation
export default class extends Router {
    async run() {
        if (this.req.body instanceof Array) {
            return this.kernel.data.createAll(this.req.params.object, this.req.body);
        }

        else {
            return this.kernel.data.createOne(this.req.params.object, this.req.body);        
        }
    }

    onRouterVerb() {
        return Router.Verb.Post;
    }

    onRouterPath() {
        return '/api/data/:object';
    }
}