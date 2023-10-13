import _ from 'lodash';
import { Knex } from 'knex';

// Classes
import { Column } from '@system/classes/column';
import { Action } from '@system/classes/action';
import { Signal } from '@system/classes/signal';
import { ActionRing } from '@system/typedefs/action';
import { Record } from '@system/classes/record';

// Typedefs
import { ColumnType, ColumnTypeKeys } from '@system/typedefs/column';
import { ObjectType } from '@system/typedefs/object';

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

    isSeries(): boolean {
        return true;
    }

    async one(signal: Signal, record: Record): Promise<void> {
        // Sanity
        record.expect('name').a('string');
        record.expect('name').contains('.');
        record.expect('type').oneOf(ColumnTypeKeys);

        // Find the parent object
        let column = Column.from(record.data);
        let object = signal.kernel.meta.lookup(column.object_name);

        // No changes allowed to the base `system::record` object
        if (object.system_name === 'system::record') {
            return;
        }

        // Process the new column
        await signal.kernel.knex.updateTable(object.system_name, t => {
            let column_name = column.system_name;
            let column_type = column.type;
            let change: Knex.ColumnBuilder;

            if (column_type === ColumnType.Text) {
                change = t.text(column_name);
            }
            
            else if (column_type === ColumnType.TextArray) {
                change = t.specificType(column_name, 'text ARRAY');
            }
            
            else if (column_type === ColumnType.Boolean) {
                change = t.boolean(column_name);
            }
            
            else if (column_type === ColumnType.Decimal) {
                change = t.decimal(column_name);
            }
            
            else if (column_type === ColumnType.Integer) {
                change = t.integer(column_name);
            }

            else if (column_type === ColumnType.Json) {
                change = t.jsonb(column_name);
            }

            else if (column_type === ColumnType.Enum) {
                change = t.specificType(column_name, 'text ARRAY');
            }

            else if (column_type === ColumnType.Uuid) {
                change = t.specificType(column_name, 'uuid');
            }

            else {
                throw new Error('Unknown column type: ' + column_type);
            }

            // Is the column required?
            if (record.data.required) {
                change = change.notNullable();
            }

            else {
                change = change.nullable();
            }

            // Is the column indexed or unique?
            // TODO
        });

        // Add the column data to kernel meta
        signal.kernel.meta.addColumn(record.data);
    }
}
