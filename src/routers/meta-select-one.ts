import _ from 'lodash';

// API
import { Router } from '@classes/router';
import { SchemaType } from '@typedefs/schema';

// Implementation
export default class extends Router {
    async run() {
        let schema_name = this.params.schema;
        let record_name = this.params.record;

        if (schema_name === SchemaType.Schema) {
            return this.kernel.data.search404(SchemaType.Schema, { where: { schema_name: record_name }});
        }

        else {
            return this.kernel.data.search404(this.params.schema, { where: { name: record_name }});
        }
    }

    onHttpVerb() {
        return Router.Verb.Get;
    }

    onHttpPath() {
        return '/api/meta/:schema/:record';
    }
}