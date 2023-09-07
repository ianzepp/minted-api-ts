import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '../classes/observer';
import { ObserverRing } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Record } from '../classes/record';

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
        let created_at = new Date().toISOString();
        let created_by = flow.system.user.id;
        let created_ns = flow.system.user.ns;

        // Populate insertion data
        _.each(flow.change, record => {
            record.data.id = uuid();
            record.data.ns = created_ns;
            record.info.created_at = created_at;
            record.info.created_by = created_by;
        });

        // Extract the insertion data
        let insert_data = this.toExtract(flow.change, 'data');
        let insert_info = this.toExtract(flow.change, 'info');
        let insert_acls = this.toExtract(flow.change, 'acls');

        // Insert data
        await flow.system.knex.toTx(schema_name).insert(insert_data);
        await flow.system.knex.toTx(schema_name + '_info').insert(insert_info);
        await flow.system.knex.toTx(schema_name + '_acls').insert(insert_acls);
    }
}
