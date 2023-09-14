import _ from 'lodash';
import { graphql, buildSchema } from 'graphql';

// API
import { Router } from '@classes/router';

/**
 * This router handles a GraphQL formatted query and returns results.
 */
export default class extends Router {
    async run() {
        let query = this.search.query;


    }

    onHttpVerb() {
        return Router.Verb.Get;
    }

    onHttpPath() {
        return '/api/graphql';
    }
}