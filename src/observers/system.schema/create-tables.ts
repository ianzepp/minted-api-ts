import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { AutoInstall } from '../../classes/autoinstall';
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { ObserverRing } from '../../layouts/observer';
import { Record } from '../../classes/record';
import { Schema } from '../../classes/schema';
import { SchemaType } from '../../classes/schema-type';

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

    onCreate(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        await Promise.all(flow.change.map(record => this.one(flow, record)));
    }

    async one(flow: ObserverFlow, record: Record) {
        let auto = new AutoInstall(flow.system);

        // Create the empty table with no default columns
        await auto.createTable(record.data.schema_name, table => {});

        // Explicitly add the schema data to the local metadata for this execution context
        // HACK TODO
        flow.system.meta.schemas[record.data.schema_name] = new Schema(record.data);
    }
}
