import _ from 'lodash';

// Classes
import { ColumnType } from '../../layouts/column';
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { ObserverRing } from '../../layouts/observer';
import { Column } from '../../classes/column';
import { SchemaType } from '../../classes/schema';

export default class extends Observer {
    toName(): string {
        return 'column.knex-create-columns';
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

    async run(flow: ObserverFlow): Promise<void> {
        for(let record of flow.change) {
            let system = flow.system;
            let schema_name = record.data.schema_name;
            let column_name = record.data.column_name;

            await system.knex.schema.table(schema_name, t => {
                let column_type = record.data.column_type;
                
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

            // Explicitly add the column data
            let schema = system.meta.toSchema(record.data.schema_name);
            schema.columns[record.data.column_name] = new Column(record.data);
        }
    }
}
