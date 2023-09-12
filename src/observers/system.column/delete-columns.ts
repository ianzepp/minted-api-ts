import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { ObserverRing } from '@layouts/observer';
import { Record } from '@classes/record';
import { SchemaType } from '@classes/schema-type';

export default class extends Observer {
    toName(): string {
        return 'column.knex-delete-columns';
    }
    
    onSchema(): string {
        return SchemaType.Column;
    }

    onRing(): ObserverRing {
        return ObserverRing.Post;
    }

    onDelete(): boolean {
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
            return t.dropColumn(column_name);
        });

        // Explicitly remove the column data
        let schema = flow.system.meta.toSchema(record.data.schema_name);
        delete schema.columns[record.data.column_name];
    }
}
