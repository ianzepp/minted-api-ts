import _ from 'lodash';

// Classes
import { Column } from '@classes/column';
import { Observer } from '@classes/neuron';
import { Signal } from '@classes/signal';
import { ObserverRing } from '@typedefs/neuron';
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

    async run(signal: Signal): Promise<void> {
        await Promise.all(signal.change.map(record => this.one(signal, record)));
    }

    async one(signal: Signal, record: Record) {
        // Create temporary refs
        let column = Column.from(record.data);
        let schema = signal.kernel.meta.schemas.get(column.schema_name);

        await signal.kernel.knex.schema.table(`${schema.name}/data`, t => {            
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
        schema.insert(column);

        // Add the column data to the kernel metadata
        signal.kernel.meta.columns.set(column.name, column);
    }
}
