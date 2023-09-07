import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Knex } from 'knex';

import { migrationInsertAll as insertAll } from '../classes/helpers';
import tableUp from '../helpers/tableUp';
import tableDown from '../helpers/tableDown';

export async function up(knex: Knex): Promise<void> {
    // Create top-level system table
    await knex.schema.createTable('system', (table) => {
        table.string('ns').primary().notNullable();
    });

    // Insert system namespace
    await knex('system').insert({ 'ns': 'system' });
    await knex('system').insert({ 'ns': 'test' });

    // Create the core tables
    await tableUp(knex, 'schema');
    await tableUp(knex, 'column');

    // Define core table structure
    await knex.schema.table('schema', (table) => {
        table.string('schema_name').notNullable();
        table.string('schema_type').notNullable().defaultTo('database');
        table.boolean('metadata').defaultTo(false);
    });

    await knex.schema.table('column', (table) => {
        table.string('schema_name').notNullable();
        table.string('column_name').notNullable();
        table.string('column_type').notNullable().defaultTo('text');

        table.boolean('audited').defaultTo(false);
        table.boolean('immutable').defaultTo(false);
        table.boolean('indexed').defaultTo(false);
        table.boolean('internal').defaultTo(false);
        table.boolean('required').defaultTo(false);
        table.boolean('unique').defaultTo(false);

        table.integer('minimum');
        table.integer('maximum');
    });

    // Add core schemas
    let schemas = await insertAll(knex, 'schema', [
        { ns: 'system', schema_name: 'schema', schema_type: 'database', metadata: true },
        { ns: 'system', schema_name: 'column', schema_type: 'database', metadata: true },
    ]);

    // Add core columns
    let columns = await insertAll(knex, 'column', [
        // Schema columns
        { ns: 'system', schema_name: 'schema', column_name: 'schema_name' },
        { ns: 'system', schema_name: 'schema', column_name: 'metadata', column_type: 'boolean' },

        // Column columns
        { ns: 'system', schema_name: 'column', column_name: 'schema_name', required: true, immutable: true, indexed: true },
        { ns: 'system', schema_name: 'column', column_name: 'column_name', required: true, immutable: true, indexed: true },
        { ns: 'system', schema_name: 'column', column_name: 'column_type', required: true, immutable: true, indexed: true },

        { ns: 'system', schema_name: 'column', column_name: 'audited', column_type: 'boolean' },
        { ns: 'system', schema_name: 'column', column_name: 'immutable', column_type: 'boolean' },
        { ns: 'system', schema_name: 'column', column_name: 'indexed', column_type: 'boolean' },
        { ns: 'system', schema_name: 'column', column_name: 'internal', column_type: 'boolean' },
        { ns: 'system', schema_name: 'column', column_name: 'required', column_type: 'boolean' },
        { ns: 'system', schema_name: 'column', column_name: 'unique', column_type: 'boolean' },

        { ns: 'system', schema_name: 'column', column_name: 'minimum', column_type: 'integer' },
        { ns: 'system', schema_name: 'column', column_name: 'maximum', column_type: 'integer' },
    ]);
}

export async function down(knex: Knex): Promise<void> {
    await tableDown(knex, 'column');
    await tableDown(knex, 'schema');

    // Delete system namespace
    await knex.schema.dropTableIfExists('system');
}

