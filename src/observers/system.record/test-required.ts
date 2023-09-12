import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { ObserverRing } from '@layouts/observer';
import { RecordColumnRequiredError } from '@classes/system-data';

export default class extends Observer {
    toName(): string {
        return 'record.test-immutable';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return ObserverRing.Test;
    }

    onCreate(): boolean {
        return true;
    }

    onUpdate(): boolean {
        return true;
    }

    onUpsert(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        for(let column of flow.schema.columns.values()) {
            if (column.required === false) {
                continue;
            }

            for(let record of flow.change) {
                let data = record.get(column);

                if (data !== null) {
                    continue;
                }

                throw new RecordColumnRequiredError(`schema '${column.schema_name}' column '${column.column_name}' is required`);
            }
        }
   }
}