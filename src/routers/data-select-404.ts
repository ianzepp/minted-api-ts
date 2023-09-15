import _ from 'lodash';

// API
import { Router } from '@classes/router';
import { UUID_REGEX } from '@classes/kernel';
import { SchemaType } from '@typedefs/schema';

// Implementation
export default class extends Router {
    async run() {
        let schema = this.kernel.meta.schemas.get(this.params.schema);

        // If the record slug is a UUID, then search by ID.
        if (this.params.record.match(UUID_REGEX)) {
            return this.kernel.data.select404(schema, this.params.record);
        }

        // Is this a `system.schema`?
        if (schema.is(SchemaType.Schema)) {
            return this.kernel.data.search404(schema, { where: { schema_name: this.params.record }});
        }

        // Is this a `system.column`?
        if (schema.is(SchemaType.Column)) {
            let parts = this.params.record.split(':');
            return this.kernel.data.search404(schema, { where: { schema_name: parts[0], column_name: parts[1] }});
        }

        // Otherwise, if the schema has a `name` property, then search by the name
        if (schema.columns.get('name')) {
            return this.kernel.data.search404(schema, { where: { name: this.params.record }});
        }

        // Unknown how to handle this
        this.kernel.expect(false, 'Unknown [record] slug type');
    }

    onHttpVerb() {
        return Router.Verb.Get;
    }

    onHttpPath() {
        return '/api/data/:schema/:record';
    }
}