import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Thread } from '@classes/thread';
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

    async run(thread: Thread): Promise<void> {
        await Promise.all(thread.change.map(record => this.one(thread, record)));
    }

    async one(thread: Thread, record: Record) {
        let schema_name = record.data.schema_name;
        let column_name = record.data.name;
        let column_type = record.data.type;

        let [ ns, sn ] = record.data.schema_name.split('.');

        await thread.kernel.knex.schema.table(`${ns}__data.${sn}`, t => {            
            return t.dropColumn(column_name);
        });

        // Setup
        let schema = thread.kernel.meta.schemas.get(schema_name);
        let column = schema.columns.get(column_name);

        // Delete the column data from the parent schema
        schema.columns.delete(column_name);

        // Delete the column data from the kernel metadata
        thread.kernel.meta.columns.delete(column.column_path);
    }
}
