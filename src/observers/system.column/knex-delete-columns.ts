import _ from 'lodash';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { ObserverRing } from '../../layouts/observer';

export default class extends Observer {
    toName(): string {
        return 'column.knex-delete-columns';
    }
    
    onSchema(): string {
        return 'column';
    }

    onRing(): ObserverRing {
        return ObserverRing.Post;
    }

    onDelete(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        for(let record of flow.change) {
            let system = flow.system;
            let schema_name = record.data.schema_name;
            let column_name = record.data.column_name;

            await system.knex.schema.table(`system_data.${schema_name}`, t => {
                return t.dropColumn(column_name);
            });

            // Explicitly remove the column data
            let schema = system.meta.toSchema(record.data.schema_name);
            delete schema.columns[record.data.column_name];
        }
    }
}
