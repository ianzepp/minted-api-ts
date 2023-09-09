import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Knex } from 'knex';

import knexCreateTable from '../helpers/knex-create-table';
import knexInsertAll from '../helpers/knex-insert-all';

export async function up(knex: Knex): Promise<void> {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

    await knex.raw('CREATE SCHEMA IF NOT EXISTS system_data;');
    await knex.raw('GRANT USAGE, CREATE ON SCHEMA system_data TO PUBLIC;');

    await knex.raw('CREATE SCHEMA IF NOT EXISTS system_meta;');
    await knex.raw('GRANT USAGE, CREATE ON SCHEMA system_meta TO PUBLIC;');

    await knex.raw('CREATE SCHEMA IF NOT EXISTS system_acls;');
    await knex.raw('GRANT USAGE, CREATE ON SCHEMA system_acls TO PUBLIC;');

    // Create the core tables
    await knexCreateTable(knex, 'schema');
    await knexCreateTable(knex, 'column');
    await knexCreateTable(knex, 'test');

    // Define core table structure
    await knex.schema.table('system_data.schema', (table) => {
        table.string('schema_name').notNullable();
        table.string('schema_type').notNullable().defaultTo('database');

        table.boolean('external').defaultTo(false);
        table.boolean('metadata').defaultTo(false);
    });

    await knex.schema.table('system_data.column', (table) => {
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

    await knex.schema.table('system_data.test', (table) => {
        table.string('name').notNullable();
        table.boolean('data_boolean');
        table.decimal('data_decimal');
        table.integer('data_integer');
        table.text('data_text');
    });

    // Add core schemas
    let schemas = await knexInsertAll(knex, 'schema', [
        { ns: 'system', schema_name: 'schema', schema_type: 'database', metadata: true },
        { ns: 'system', schema_name: 'column', schema_type: 'database', metadata: true },
        { ns: 'system', schema_name: 'test', schema_type: 'database', metadata: false },
    ]);

    // Add core columns
    let columns = await knexInsertAll(knex, 'column', [
        // Columns for 'schema'
        { ns: 'system', schema_name: 'schema', column_name: 'schema_name' },
        { ns: 'system', schema_name: 'schema', column_name: 'metadata', column_type: 'boolean' },

        // Columns for 'column'
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

        // Columns for 'test'
        { ns: 'system', schema_name: 'test', column_name: 'name', required: true },
        { ns: 'system', schema_name: 'test', column_name: 'data_boolean', column_type: 'boolean' },
        { ns: 'system', schema_name: 'test', column_name: 'data_decimal', column_type: 'decimal' },
        { ns: 'system', schema_name: 'test', column_name: 'data_integer', column_type: 'integer' },
        { ns: 'system', schema_name: 'test', column_name: 'data_text', column_type: 'text' },
    ]);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw('DROP SCHEMA IF EXISTS system_acls CASCADE;');
    await knex.raw('DROP SCHEMA IF EXISTS system_meta CASCADE;');
    await knex.raw('DROP SCHEMA IF EXISTS system_data CASCADE;');
}

