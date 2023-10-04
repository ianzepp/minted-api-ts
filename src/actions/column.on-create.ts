import _ from 'lodash';

// Classes
import { Column } from '@classes/column';
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { ActionRing } from '@root/src/typedefs/action';
import { Record } from '@classes/record';

// Typedefs
import { ColumnType } from '@typedefs/column';
import { ObjectType } from '@typedefs/object';


export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return ObjectType.Column;
    }

    onRing(): ActionRing {
        return ActionRing.Post;
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
        let object = signal.kernel.meta.objects.get(column.object_name);

        await signal.kernel.data.schema.table(`${object.name}/data`, t => {            
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

        // Add the column data to the parent object
        object.insert(column);

        // Add the column data to the kernel metadata
        signal.kernel.meta.columns.set(column.name, column);
    }
}
