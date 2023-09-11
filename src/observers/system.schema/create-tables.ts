import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { Record } from '../../classes/record';
import { Schema } from '../../classes/schema';

// Layouts
import { ObserverRing } from '../../layouts/observer';

/**
 * This class extends the Observer class and provides methods for creating a schema in Knex.
 * 
 * It is responsible for calling the `knex.schema` interface and creating the actual 
 * table structures in the database, including:
 * - the `<schema_name>` base table
 * - the `<schema_name>_info` table
 * - the `<schema_name>_acls` table
 * - the `<schema_name>_logs` table
 * 
 * @class
 * @extends {Observer}
 */

export default class extends Observer {
    toName(): string {
        return 'schema.post-create';
    }
    
    onSchema(): string {
        return 'schema';
    }

    onRing(): ObserverRing {
        return ObserverRing.Post;
    }

    onCreate(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        // Generate new schemas based on the records and add them to the meta service
        for(let record of flow.change) {
            await this.createTable(flow, record);
        }
    }

    private async createTable(flow: ObserverFlow, record: Record) {
        let schema_name = record.data.schema_name;
        let system = flow.system;

        // Create base table
        await system.knex.schema.withSchema('system_data').createTable(schema_name, (table) => {
            table.uuid('id').primary().defaultTo(system.knex.fn.uuid());
            table.string('ns');
        });

        // Explicitly add the schema data to the local metadata for this execution context
        system.meta.schemas[record.data.schema_name] = new Schema(record.data);
    }
}
