import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { AutoInstall } from '@classes/autoinstall';
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { ObserverRing } from '@layouts/observer';
import { Record } from '@classes/record';
import { Schema } from '@classes/schema';
import { SchemaType } from '@classes/schema-type';

export default class extends Observer {
    toName(): string {
        return __filename;
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
        // Setup
        let { schema_name, schema_type } = record.data;
        let auto = new AutoInstall(flow.system);

        // Only create schemas that are marked as `database` types
        if (schema_type !== 'database') {
            return;
        }

        // Create the empty table with no default columns
        await auto.createTable(schema_name, table => {});

        // Add to system metadata
        flow.system.meta.schemas.set(schema_name, new Schema(record.data));
    }
}
