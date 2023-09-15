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
        let schema_name = record.data.schema_name;
        let column_name = record.data.name;
        let column_type = record.data.type;

        let [ ns, sn ] = record.data.schema_name.split('.');

        await thread.kernel.knex.schema.table(`${ns}__data.${sn}`, t => {            
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

        // Setup
        let schema = thread.kernel.meta.schemas.get(schema_name);
        let column = new Column(record.data);

        // Add the column data to the parent schema
        schema.columns.set(column_name, column);

        // Add the column data to the kernel metadata
        thread.kernel.meta.columns.set(column.column_path, column);
    }
}
