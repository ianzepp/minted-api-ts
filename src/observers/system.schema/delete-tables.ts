import _ from 'lodash';

// Classes
import { AutoInstall } from '@classes/autoinstall';
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { ObserverRing } from '@layouts/observer';
import { Record } from '@classes/record';
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

    onDelete(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        await Promise.all(flow.change.map(record => this.one(flow, record)));
    }

    async one(flow: ObserverFlow, record: Record) {
        let { schema_name, schema_type } = record.data;
        let auto = new AutoInstall(flow.system);

        // Only delete schemas that are marked as `database` types
        if (schema_type !== 'database') {
            return;
        }

        // Drop the table
        await auto.deleteTable(schema_name);

        // Remove from system metadata
        flow.system.meta.schemas.delete(schema_name);
    }
}
