import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';

export default class extends Observer {
    toName() {
        return 'record.knex-create';
    }
    
    onSchema() {
        return 'record';
    }

    onRing() {
        return Observer.RING_KNEX;
    }

    onCreate() {
        return true;
    }

    async run(flow: ObserverFlow) {
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
            id: record.data.id,
            id_table: flow.schema.name,
        }));

        // Insert data
        await flow.system.knex.using(flow.schema.name).insert(insert_data);
        await flow.system.knex.using('metainfo').insert(insert_info);
    }
}
