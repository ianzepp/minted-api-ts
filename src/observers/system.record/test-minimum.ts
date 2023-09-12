import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { Column } from '@classes/column';

// Layouts
import { ObserverRing } from '@layouts/observer';


export default class extends Observer {
    toName(): string {
        return 'record.test-minimum';
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
            if (column.minimum === null) {
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

                if (data >= column.minimum) {
                    continue;
                }

                // Failed test
                flow.fail(300, `"${column.column_name}" value "${data}" < minimum of "${column.minimum}"`, record);
            }
        }
   }
}