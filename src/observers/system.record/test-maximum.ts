import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';

// Layouts
import { ObserverRing } from '@layouts/observer';
import { DataError } from '@classes/system-data';


export default class extends Observer {
    toName(): string {
        return 'record.test-maximum';
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
        for(let column of Object.values(flow.schema.columns)) {
            if (column.maximum === null) {
                continue;
            }

            for(let record of flow.change) {
                let data = record.get(column);

                if (data === null) {
                    continue;
                }

                if (typeof data !== 'number') {
                    continue;
                }

                if (data <= column.maximum) {
                    continue;
                }

                // Failed test
                throw new DataError(`"${column.column_name}" value "${data}" > maximum of "${column.maximum}"`);
            }
        }
   }
}