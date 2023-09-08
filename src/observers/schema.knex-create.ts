import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Knex } from 'knex';

// Classes
import { KnexDriver } from '../classes/knex';
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Record } from '../classes/record';

// Layouts
import { ObserverRing } from '../layouts/observer';

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
        return 'schema.knex-create';
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
        // Define the top-level knex change.
        let knex = flow.system.knex.toSchemaTx();

        // Unfortunately, knex requires record updates be done individually. We can help
        // reduce the load by running all the changes in parallel as Promises
        let operations = flow.change.map(record => this.toCreateTable(knex, record));

        // Wait for everything to finish
        await Promise.all(operations);
    }

    private async toCreateTable(knex: Knex.SchemaBuilder, record: Record) {
        let table_name = record.data.schema_name;

        // Create base table
        await knex.createTableIfNotExists(table_name, t => {
            t.uuid('id').primary().defaultTo(KnexDriver.fn.uuid());
            t.string('ns').notNullable().references('ns').inTable('system').onDelete('CASCADE');
        });

        await knex.createTableIfNotExists(table_name + '_info', t => {
            t.uuid('id').primary().references('id').inTable(table_name).onDelete('CASCADE');
            t.string('ns').notNullable().references('ns').inTable('system').onDelete('CASCADE');
    
            t.timestamp('created_at').index();
            t.timestamp('updated_at').index();
            t.timestamp('expired_at').index();
            t.timestamp('deleted_at').index();
    
            t.uuid('created_by').index();
            t.uuid('updated_by').index();
            t.uuid('expired_by').index();
            t.uuid('deleted_by').index();
        });

        await knex.createTableIfNotExists(table_name + '_acls', t => {
            t.uuid('id').primary().references('id').inTable(table_name).onDelete('CASCADE');
            t.string('ns').notNullable().references('ns').inTable('system').onDelete('CASCADE');
    
            t.specificType('acls_full', 'uuid ARRAY').index();
            t.specificType('acls_edit', 'uuid ARRAY').index();
            t.specificType('acls_read', 'uuid ARRAY').index();
            t.specificType('acls_deny', 'uuid ARRAY').index();
        });
    }

}
