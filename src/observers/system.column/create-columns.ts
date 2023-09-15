import _ from 'lodash';

// Classes
import { Column } from '@classes/column';
import { Observer } from '@classes/observer';
import { Thread } from '@classes/thread';
import { ObserverRing } from '@typedefs/observer';
import { Record } from '@classes/record';

// Typedefs
import { ColumnType } from '@typedefs/column';
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

    onCreate(): boolean {
        return true;
    }

    async run(thread: Thread): Promise<void> {
        await Promise.all(thread.change.map(record => this.one(thread, record)));
    }

    async one(thread: Thread, record: Record) {
        // Create temporary refs
        let column = new Column(record.data);
        let schema = thread.kernel.meta.schemas.get(column.schema_name);

        let [ ns, sn ] = schema.name.split('.');

        await thread.kernel.knex.schema.table(`${ns}__data.${sn}`, t => {            
            let column_type = column.type;
            let column_name = column.column_name;

            if (column_type === ColumnType.Text) {
                return t.text(column_name);
            }
            
            if (column_type === ColumnType.Boolean) {
                return t.boolean(column_name);
            }
            
            if (column_type === ColumnType.Decimal) {
                return t.decimal(column_name);
            }
            
            if (column_type === ColumnType.Integer) {
                return t.integer(column_name);
            }

            if (column_type === ColumnType.Json) {
                return t.jsonb(column_name);
            }

            if (column_type === ColumnType.Enum) {
                return t.specificType(column_name, 'string ARRAY');
            }

            // Invalid column type
        });

        // Add the column data to the parent schema
        schema.columns.set(column.column_name, column);

        // Add the column data to the kernel metadata
        thread.kernel.meta.columns.set(column.name, column);
    }
}
