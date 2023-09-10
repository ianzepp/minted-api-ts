import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Knex } from 'knex';
import { System } from '../classes/system';

import knexCreateTable from '../helpers/knex-create-table';
import knexDropTable from '../helpers/knex-drop-table';
import knexInsertAll from '../helpers/knex-insert-all';

export async function up(knex: Knex): Promise<void> {
    await knexCreateTable(knex, 'system.user');

    // Update table structure
    await knex.schema.table('system.user', (table) => {
        table.string('ns').references('ns').inTable('system.client').onDelete('CASCADE').alter();
        table.string('name').notNullable();
    });

    // Add schema records
    await knexInsertAll(knex, 'system.schema', [
        { ns: 'system', schema_name: 'system.user', schema_type: 'database' },
    ]);
    
    // Add column records
    await knexInsertAll(knex, 'system.column', [
        { ns: 'system', schema_name: 'system.column', column_name: 'system.name', required: true },
        // none
    ]);

    // Add table data
    await knexInsertAll(knex, 'system.user', [
        { ns: System.RootNs, id: System.RootId, name: "API root user" },
        { ns: System.TestNs, id: System.TestId, name: "API test user" },
    ]);
}


export async function down(knex: Knex): Promise<void> {
    // Remove schema record
    await knex('system.schema')
        .where('ns', 'system')
        .where('schema_name', 'system.user')
        .delete();

    // Remove column record
    await knex('system.column')
        .where('ns', 'system')
        .where('schema_name', 'system.user')
        .delete();

    // Remove tables
    await knexDropTable(knex, 'system.user');
}

