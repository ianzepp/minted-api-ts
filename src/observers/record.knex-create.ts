import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '../classes/observer';
import { ObserverRing } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Schema } from '../classes/schema';
import { SchemaType } from '../classes/schema';

export default class extends Observer {
    toName(): string {
        return 'record.knex-create';
    }
    
    onSchema(): SchemaType {
        return Schema.Type.Record;
    }

    onRing(): ObserverRing {
        return Observer.Ring.Knex;
    }

    onCreate(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        // Populate insertion data
        _.each(flow.change, record => {
            record.data.id = uuid();
            record.data.ns = null;
            record.data.sc = null;
            record.info.created_at = new Date().toISOString();
            record.info.created_by = null;
        });

        // Extract the insertion data
        let insert_data = _.map(flow.change, record => _.merge({}, record.data));
        let insert_info = _.map(flow.change, record => _.merge({}, record.info, { 
            record_id: record.data.id,
        }));

        // Insert data
        await flow.system.knex.toTx(flow.schema_name).insert(insert_data);
        await flow.system.knex.toTx(flow.schema_name + '_info').insert(insert_info);
    }
}
