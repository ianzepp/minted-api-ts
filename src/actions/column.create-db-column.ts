import _ from 'lodash';

// Classes
import { Column } from '@classes/column';
import { Action } from '@classes/action';
import { Signal } from '@classes/signal';
import { ActionRing } from '@typedefs/action';
import { Record } from '@classes/record';

// Typedefs
import { ColumnType, ColumnTypeKeys } from '@typedefs/column';
import { ObjectType } from '@typedefs/object';

// Table operations
import { sign } from 'jsonwebtoken';

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

        // Create temporary refs
        let [object_name, column_name] = record.data.name.split('.');

        await signal.kernel.knex.updateTable(object_name, t => {
            let column_type = record.data.type;
            let column;

            if (column_type === ColumnType.Text) {
                column = t.text(column_name);
            }
            
            else if (column_type === ColumnType.TextArray) {
                column = t.specificType(column_name, 'text ARRAY');
            }
            
            else if (column_type === ColumnType.Boolean) {
                column = t.boolean(column_name);
            }
            
            else if (column_type === ColumnType.Decimal) {
                column = t.decimal(column_name);
            }
            
            else if (column_type === ColumnType.Integer) {
                column = t.integer(column_name);
            }

            else if (column_type === ColumnType.Json) {
                column = t.jsonb(column_name);
            }

            else if (column_type === ColumnType.Enum) {
                column = t.specificType(column_name, 'text ARRAY');
            }

            else if (column_type === ColumnType.Uuid) {
                column = t.specificType(column_name, 'uuid');
            }

            else {
                throw new Error('Unknown column type: ' + column_type);
            }

            // Invalid column type
        });

        // Add the column data to kernel meta
        signal.kernel.meta.addColumn(record.data);
    }
}
