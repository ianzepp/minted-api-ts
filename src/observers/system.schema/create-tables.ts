import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { KnexDriver } from '../../classes/knex';
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { Record } from '../../classes/record';
import { Schema } from '../../classes/schema';

// Layouts
import { ObserverRing } from '../../layouts/observer';

// Helpers
import knexCreateTable from '../../helpers/knex-create-table';

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
            table.uuid('id').primary().defaultTo(KnexDriver.fn.uuid());
            table.string('ns');
        });

        // Meta table
        await system.knex.schema.withSchema('system_meta').createTable(schema_name, (table) => {
            table.uuid('id').primary().references('id').inTable('system_data.' + schema_name).onDelete('CASCADE');
            table.string('ns');

            table.timestamp('created_at').index();
            table.timestamp('updated_at').index();
            table.timestamp('expired_at').index();
            table.timestamp('deleted_at').index();

            table.uuid('created_by').index();
            table.uuid('updated_by').index();
            table.uuid('expired_by').index();
            table.uuid('deleted_by').index();
        });

        await system.knex.schema.withSchema('system_acls').createTable(schema_name, (table) => {
            table.uuid('id').primary().references('id').inTable('system_data.' + schema_name).onDelete('CASCADE');
            table.string('ns');

            table.specificType('acls_full', 'uuid ARRAY').index();
            table.specificType('acls_edit', 'uuid ARRAY').index();
            table.specificType('acls_read', 'uuid ARRAY').index();
            table.specificType('acls_deny', 'uuid ARRAY').index();
        });
    }
}
