import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Knex } from 'knex';

import { migrationInsertAll } from '../classes/helpers';
import tableUp from '../helpers/tableUp';
import tableDown from '../helpers/tableDown';

export async function up(knex: Knex): Promise<void> {
    // Explicit here
    await knex.schema.createTable('system', (table) => {
        table.string('ns').primary().notNullable();
    });

    // Create the core tables
    await tableUp(knex, 'schema');
    await tableUp(knex, 'column');

    // Add custom columns
    await knex.schema.table('schema', (table) => {
        table.string('schema_name').notNullable();
        table.text('description');
    });

    await knex.schema.table('column', (table) => {
        table.string('schema_name').notNullable();
        table.string('column_name').notNullable();
        table.text('description');
    });

    // Add core schemas
    let schemas = await migrationInsertAll(knex, 'schema', [
        { schema_name: 'schema' },
        { schema_name: 'column' },
    ]);

    // Add core columns
    let columns = await migrationInsertAll(knex, 'column', [
        { schema_name: 'schema', column_name: 'schema_name' },
        { schema_name: 'schema', column_name: 'description' },

        { schema_name: 'column', column_name: 'schema_name' },
        { schema_name: 'column', column_name: 'column_name' },
        { schema_name: 'column', column_name: 'description' },
    ]);
}

export async function down(knex: Knex): Promise<void> {
    await tableDown(knex, 'column');
    await tableDown(knex, 'schema');

    // Explicit here
    await knex.schema.dropTableIfExists('system');
}

