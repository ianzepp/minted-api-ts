import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { ObserverRing } from '@layouts/observer';
import { Record } from '@classes/record';
import { SchemaType } from '@classes/schema-type';

export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return SchemaType.Column;
    }

    onRing(): ObserverRing {
        return ObserverRing.Post;
    }

    onDelete(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        await Promise.all(flow.change.map(record => this.one(flow, record)));
    }

    async one(flow: ObserverFlow, record: Record) {
        let { schema_name, column_name, column_type } = record.data;
        let [ ns, sn ] = record.data.schema_name.split('.');

        await flow.system.knex.schema.table(`${ns}__data.${sn}`, t => {            
            return t.dropColumn(column_name);
        });

        // Setup
        let schema = flow.system.meta.schemas.get(schema_name);
        let column = schema.columns.get(column_name);

        // Delete the column data from the parent schema
        schema.columns.delete(column_name);

        // Delete the column data from the system metadata
        flow.system.meta.columns.delete(column.column_path);
    }
}
