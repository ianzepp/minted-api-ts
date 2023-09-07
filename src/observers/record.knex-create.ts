import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '../classes/observer';
import { ObserverRing } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Schema } from '../classes/schema';

export default class extends Observer {
    toName(): string {
        return 'record.knex-create';
    }
    
    onSchema(): string {
        return 'record';
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
            record.data.ns = flow.system.user.ns;
            record.info.created_at = new Date().toISOString();
            record.info.created_by = flow.system.user.id;
        });

        // Extract the insertion data
        let insert_data = _.map(flow.change, record => _.merge({}, record.data));
        let insert_info = _.map(flow.change, record => _.merge({}, record.info, { 
            id: record.data.id,
            ns: record.data.ns,
        }));
        
        let insert_acls = _.map(flow.change, record => _.merge({}, record.acls, { 
            id: record.data.id,
            ns: record.data.ns,
        }));

        // Insert data
        await flow.system.knex.toTx(flow.schema_name).insert(insert_data);
        await flow.system.knex.toTx(flow.schema_name + '_info').insert(insert_info);
        await flow.system.knex.toTx(flow.schema_name + '_acls').insert(insert_acls);
    }
}
