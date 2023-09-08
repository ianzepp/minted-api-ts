import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Record } from '../classes/record';

// Layouts
import { ObserverRing } from '../layouts/observer';


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
        let created_by = flow.system.user.id;
        let created_ns = flow.system.user.ns;

        // Populate insertion data
        _.each(flow.change, record => {
            record.data.id = uuid();
            record.data.ns = created_ns;
            record.meta.created_at = created_at;
            record.meta.created_by = created_by;
        });

        // Extract the insertion data
        let insert_data = this.toExtract(flow.change, 'data');
        let insert_meta = this.toExtract(flow.change, 'meta');
        let insert_acls = this.toExtract(flow.change, 'acls');

        // Insert data
        await flow.system.knex.toTx('system_data.' + schema_name).insert(insert_data);
        await flow.system.knex.toTx('system_meta.' + schema_name).insert(insert_meta);
        await flow.system.knex.toTx('system_acls.' + schema_name).insert(insert_acls);
    }
}
