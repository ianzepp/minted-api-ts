import _ from 'lodash';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { ObserverRing } from '../../layouts/observer';
import { RecordColumnImmutableError } from '../../classes/system-data';
import { SchemaType } from '../../classes/schema';

export default class extends Observer {
    toName(): string {
        return 'record.test-immutable';
    }
    
    onSchema(): string {
        return SchemaType.Record;
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

                throw new RecordColumnImmutableError(column.column_name);
            }
        }
   }
}