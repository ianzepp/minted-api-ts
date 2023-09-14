import _ from 'lodash';

// Classes
import { AutoInstall } from '@classes/autoinstall';
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { Record } from '@classes/record';

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

    onDelete(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        await Promise.all(flow.change.map(record => this.one(flow, record)));
    }

    async one(flow: ObserverFlow, record: Record) {
        let { schema_name, schema_type } = record.data;
        let auto = new AutoInstall(flow.kernel);

        // Only delete schemas that are marked as `database` types
        if (schema_type !== 'database') {
            return;
        }

        // Drop the table
        await auto.deleteTable(schema_name);

        // Remove from kernel metadata
        flow.kernel.meta.schemas.delete(schema_name);
    }
}
