import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { AutoInstall } from '@classes/autoinstall';
import { Observer } from '@classes/observer';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';
import { Schema } from '@classes/schema';

// Typedefs
import { ObserverRing } from '@typedefs/observer';
import { SchemaType } from '@typedefs/schema';


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

    async run(signal: Signal): Promise<void> {
        await Promise.all(signal.change.map(record => this.one(signal, record)));
    }

    async one(signal: Signal, record: Record) {
        // Setup
        let schema_name = record.data.name;
        let schema_type = record.data.type;
        let auto = new AutoInstall(signal.kernel);

        // Only create schemas that are marked as `database` types
        if (schema_type !== 'database') {
            return;
        }

        // Create the empty table with no default columns
        await auto.createTable(schema_name, table => {});

        // Add to kernel metadata
        signal.kernel.meta.schemas.set(schema_name, Schema.from(record.data));
    }
}
