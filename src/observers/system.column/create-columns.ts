import _ from 'lodash';

// Classes
import { Column } from '@classes/column';
import { ColumnType } from '@layouts/column';
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { ObserverRing } from '@layouts/observer';
import { Record } from '@classes/record';
import { SchemaType } from '@classes/schema-type';

export default class extends Observer {
    toName(): string {
        return 'column.create-columns';
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
        await Promise.all(flow.change.map(record => this.one(flow, record)));
    }

    async one(flow: ObserverFlow, record: Record) {
        let column_name = record.data.column_name;
        let column_type = record.data.column_type;
        let [ns, sn] = record.data.schema_name.split('.');

        await flow.system.knex.schema.table(`${ns}__data.${sn}`, t => {            
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

        // HACK TODO Explicitly add the column data
        let schema = flow.system.meta.toSchema(record.data.schema_name);
        schema.columns[record.data.column_name] = new Column(record.data, schema);
    }
}
