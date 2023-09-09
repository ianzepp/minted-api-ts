import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { Record } from '../../classes/record';

// Layouts
import { ObserverRing } from '../../layouts/observer';


export default class extends Observer {
    toName(): string {
        return 'record.knex-create';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
    }

    onCreate(): boolean {
        return true;
    }

    toExtract(record_set: Record[], record_property: string) {
        return record_set.map(record => _.assign({
            id: record.data.id,
            ns: record.data.ns,
        }, _.get(record, record_property)) as _.Dictionary<any>);
    }

    toExtractData(record_set: Record[]) {
        return this.toExtract(record_set, 'data');
    }

    toExtractInfo(record_set: Record[]) {
        return this.toExtract(record_set, 'info');
    }

    toExtractAcls(record_set: Record[]) {
        return this.toExtract(record_set, 'acls');
    }

    async run(flow: ObserverFlow): Promise<void> {
        let schema_name = flow.schema.schema_name;
        let created_at = new Date(flow.system.timestamp);
        let created_by = flow.system.user_id;
        let created_ns = flow.system.user_ns;

        // Populate insertion data
        for(let record of flow.change) {
            record.data.id = uuid();
            record.data.ns = created_ns;
            record.meta.created_at = created_at;
            record.meta.created_by = created_by;
        }

        // Extract the insertion data
        let insert_data = this.toExtract(flow.change, 'data');
        let insert_meta = this.toExtract(flow.change, 'meta');
        let insert_acls = this.toExtract(flow.change, 'acls');

        // Insert data
        insert_data = await flow.system.knex.driver('system_data.' + schema_name).insert(insert_data).returning('*');
        insert_meta = await flow.system.knex.driver('system_meta.' + schema_name).insert(insert_meta).returning('*');
        insert_acls = await flow.system.knex.driver('system_acls.' + schema_name).insert(insert_acls).returning('*');

        // Copy back to records
        for(let i in flow.change) {
            let record = flow.change[i];
            _.assign(record.data, insert_data[i]);
            _.assign(record.meta, insert_meta[i]);
            _.assign(record.acls, insert_acls[i]);
        }
    }
}
