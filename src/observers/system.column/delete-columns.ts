import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Thread } from '@classes/thread';
import { Record } from '@classes/record';

// Typedefs
import { ObserverRing } from '@typedefs/observer';
import { SchemaType } from '@typedefs/schema';
import { Column } from '@classes/column';


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
        // Create temporary refs
        let column = new Column(record.data);
        let schema = thread.kernel.meta.schemas.get(column.schema_name);

        let [ ns, sn ] = schema.path();

        await thread.kernel.knex.schema.table(`${ns}__data.${sn}`, t => {            
            return t.dropColumn(column.column_name);
        });

        // Delete the column data from the parent schema
        schema.columns.delete(column.column_name);

        // Delete the column data from the kernel metadata
        thread.kernel.meta.columns.delete(column.name);
    }
}
