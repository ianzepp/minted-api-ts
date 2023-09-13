import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { ObserverRing } from '@layouts/observer';
import { RecordColumnImmutableError } from '@classes/system-data';

export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return '*';
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
            if (column.immutable !== true) {
                continue;
            }

            for(let record of flow.change) {
                let data = record.get(column);
                let prev = record.old(column);

                if (prev === null) {
                    continue;
                }

                if (prev === data) {
                    continue;
                }

                throw new RecordColumnImmutableError(`schema '${column.schema_name}' column '${column.column_name}' is immutable: prev '${prev}' to data '${data}'`);
            }
        }
   }
}