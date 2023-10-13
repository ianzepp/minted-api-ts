import _ from 'lodash';

// API
import { Router } from '@system/classes/router';
import { ChangeData } from '@system/typedefs/record';

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