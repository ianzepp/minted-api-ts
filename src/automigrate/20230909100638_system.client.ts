import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Knex } from 'knex';

import knexCreateTable from '../helpers/knex-create-table';
import knexDropTable from '../helpers/knex-drop-table';
import knexInsertAll from '../helpers/knex-insert-all';

export const SCHEMA_NAME = 'client';

export async function up(knex: Knex): Promise<void> {
    await knexCreateTable(knex, SCHEMA_NAME);

    // Update table structure
    await knex.schema.table('system_data.' + SCHEMA_NAME, (table) => {
        table.string('ns').unique().alter();
    });

    // Add schema records
    await knexInsertAll(knex, 'schema', [
        { ns: 'system', schema_name: SCHEMA_NAME, schema_type: 'database' },
    ]);
    
    // Add column records
    await knexInsertAll(knex, 'column', [
        // none
    ]);

    // Add table data
    await knexInsertAll(knex, SCHEMA_NAME, [
        { ns: 'system' },
        { ns: 'test' },
    ]);

    // Alter the structure of the core schema/column tables
    await knex.schema.table('system_data.schema', (table) => {
        table.string('ns').references('ns').inTable('system_data.client').onDelete('CASCADE').alter();
    });

    await knex.schema.table('system_data.column', (table) => {
        table.string('ns').references('ns').inTable('system_data.client').onDelete('CASCADE').alter();
    });
}


export async function down(knex: Knex): Promise<void> {
    // Remove schema record
    await knex('system_data.schema')
        .where('ns', 'system')
        .where('schema_name', SCHEMA_NAME)
        .delete();

    // Remove column record
    await knex('system_data.column')
        .where('ns', 'system')
        .where('schema_name', SCHEMA_NAME)
        .delete();

    // Remove indexes
    await knex.schema.table('system_data.schema', (table) => {
        table.dropForeign('ns');
    });

    await knex.schema.table('system_data.column', (table) => {
        table.dropForeign('ns');
    });

    // Remove tables
    await knexDropTable(knex, SCHEMA_NAME);
}
