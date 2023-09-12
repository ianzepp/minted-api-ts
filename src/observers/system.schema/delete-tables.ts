import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { AutoInstall } from '@classes/autoinstall';
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { ObserverRing } from '@layouts/observer';
import { Record } from '@classes/record';
import { SchemaType } from '@classes/schema-type';

export default class extends Observer {
    toName(): string {
        return 'schema.post-create';
    }
    
    onSchema(): string {
        return SchemaType.Schema;
    }

    onRing(): ObserverRing {
        return ObserverRing.Post;
    }

    onDelete(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        await Promise.all(flow.change.map(record => this.one(flow, record)));
    }

    async one(flow: ObserverFlow, record: Record) {
        let auto = new AutoInstall(flow.system);

        // Drop the table
        await auto.deleteTable(record.data.schema_name);

        // Explicitly delete the schema data from the local metadata this execution context
        // HACK TODO
        delete flow.system.meta.schemas[record.data.schema_name];
    }
}
