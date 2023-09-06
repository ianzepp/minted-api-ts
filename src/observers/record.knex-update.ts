import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverRing } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Schema } from '../classes/schema';
import { SchemaType } from '../classes/schema';

export default class extends Observer {
    toName(): string {
        return 'record.knex-update';
    }
    
    onSchema(): SchemaType {
        return Schema.Type.Record;
    }

    onRing(): ObserverRing {
        return Observer.Ring.Knex;
    }

    onUpdate(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        // Updating rows requires multiple update calls. Run them async to improve response times
        let updates = flow.change.map((record, i) => {
            return flow.system.knex.toStatementFilter(flow.schema_name, flow.filter)
                .where('id', record.data.id)
                .update(record.data);
        });

        // Wait for the execution
        await Promise.all(updates);        

        // Once the data updates are done, the timestamps can be set all at once.
        let updated_at = new Date().toISOString();
        let updated_by = null as string | null;
        let record_ids = flow.change.map(record => record.data.id);

        // Write directly to the metadata table
        await flow.system.knex.toTx('metadata').whereIn('id', record_ids).update({
            updated_at: updated_at,
            updated_by: updated_by
        });

        // Apply the timestamp changes back to the records
        _.each(flow.change, record => {
            record.info.updated_at = updated_at;
            record.info.updated_by = updated_by;
        });
    }
}