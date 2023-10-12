import _ from 'lodash';

// Classes
import { Column } from '@classes/column';
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { ActionRing } from '@root/src/typedefs/action';
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

    async run(signal: Signal): Promise<void> {
        for(let record of signal.change) {
            // Sanity
            record.expect('name').a('string');
            record.expect('name').contains('.');
            record.expect('type').oneOf(ColumnTypeKeys);    

            // Create temporary refs
            let [object_name, column_name] = record.data.name.split('.');

            await signal.kernel.data.updateTable(object_name, t => {
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

                else {
                    throw new Error('Unknown column type: ' + column_type);
                }

                // Invalid column type
            });

            // Setup
            let object = signal.kernel.meta.objects.get(object_name);
            let column = Column.from(record.data);

            // Save the column to the parent object
            object.insert(column);

            // Add the column data to the kernel metadata
            signal.kernel.meta.columns.set(column.name, column);
        }
    }
}
