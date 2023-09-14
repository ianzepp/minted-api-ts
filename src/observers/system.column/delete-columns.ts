import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { Record } from '@classes/record';

// Typedefs
import { ObserverRing } from '@typedefs/observer';
import { SchemaType } from '@typedefs/schema';


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

        await flow.kernel.knex.schema.table(`${ns}__data.${sn}`, t => {            
            return t.dropColumn(column_name);
        });

        // Setup
        let schema = flow.kernel.meta.schemas.get(schema_name);
        let column = schema.columns.get(column_name);

        // Delete the column data from the parent schema
        schema.columns.delete(column_name);

        // Delete the column data from the kernel metadata
        flow.kernel.meta.columns.delete(column.column_path);
    }
}
