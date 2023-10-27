import _, { includes } from 'lodash';
import { Knex } from 'knex';

// Classes
import { Column } from '@kernel/classes/column';
import { Action } from '@kernel/classes/action';
import { Signal } from '@kernel/classes/signal';
import { Record } from '@kernel/classes/record';

// Typedefs
import { ColumnType, ColumnTypeKeys } from '@system/typedefs/column';

export default class extends Action {
    constructor() {
        super(__filename, { series: true });
    }

    async one({ kernel }: Signal, record: Record) {
        // Sanity
        record.expect('object').a('string').includes('::');
        record.expect('ns').a('string');
        record.expect('rn').a('string');
        record.expect('type').oneOf(ColumnTypeKeys);

        // Find the parent object
        let column = new Column(record.data);
        let object = kernel.meta.lookup(column.object_name);

        // No changes allowed to the base `system::record` object
        if (object.system_name === 'system::record') {
            return;
        }

        // Process the new column
        await kernel.knex.updateTable(object.system_name, t => {
            let column_name = column.system_name;
            let column_type = column.data.type;
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
        kernel.meta.registerColumn(record.data);
    }
}
