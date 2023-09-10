import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Knex } from 'knex';

import knexCreateTable from '../helpers/knex-create-table';
import knexInsertAll from '../helpers/knex-insert-all';

export async function up(knex: Knex): Promise<void> {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

    await knex.raw('CREATE SCHEMA IF NOT EXISTS system;');
    await knex.raw('GRANT USAGE, CREATE ON SCHEMA system TO PUBLIC;');

    await knex.raw('CREATE SCHEMA IF NOT EXISTS test;');
    await knex.raw('GRANT USAGE, CREATE ON SCHEMA test TO PUBLIC;');

    // Create the core tables
    await knexCreateTable(knex, 'system.client');
    await knexCreateTable(knex, 'system.schema');
    await knexCreateTable(knex, 'system.column');

    // Alter namespace foreign key constraints
    await knex.schema.table('system.client', (table) => {
        table.string('ns').unique().alter();
    });

    await knex.schema.table('system.schema', (table) => {
        table.string('ns').references('ns').inTable('system.client').onDelete('CASCADE').alter();
    });

    await knex.schema.table('system.column', (table) => {
        table.string('ns').references('ns').inTable('system.client').onDelete('CASCADE').alter();
    });

    // Define standard schema fields
    await knex.schema.table('system.schema', (table) => {
        table.string('schema_name').notNullable();
        table.string('schema_type').notNullable().defaultTo('database');

        table.boolean('external').defaultTo(false);
        table.boolean('metadata').defaultTo(false);
    });

    // Define standard column fields
    await knex.schema.table('system.column', (table) => {
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

    // Add core clients (namespaces)
    let clients = await knexInsertAll(knex, 'system.client', [
        { ns: 'system' },
        { ns: 'test' },
    ]);

    // Add core schemas
    let schemas = await knexInsertAll(knex, 'system.schema', [
        { ns: 'system', schema_name: 'system.client', schema_type: 'database' },
        { ns: 'system', schema_name: 'system.schema', schema_type: 'database', metadata: true },
        { ns: 'system', schema_name: 'system.column', schema_type: 'database', metadata: true },
    ]);

    // Add core columns
    let columns = await knexInsertAll(knex, 'system.column', [
        // Columns for 'client'
        
        // Columns for 'schema'
        { ns: 'system', schema_name: 'system.schema', column_name: 'system.schema_name' },
        { ns: 'system', schema_name: 'system.schema', column_name: 'system.metadata', column_type: 'boolean' },

        // Columns for 'column'
        { ns: 'system', schema_name: 'system.column', column_name: 'system.schema_name', required: true, immutable: true, indexed: true },
        { ns: 'system', schema_name: 'system.column', column_name: 'system.column_name', required: true, immutable: true, indexed: true },
        { ns: 'system', schema_name: 'system.column', column_name: 'system.column_type', required: true, immutable: true, indexed: true },

        { ns: 'system', schema_name: 'system.column', column_name: 'system.audited', column_type: 'boolean' },
        { ns: 'system', schema_name: 'system.column', column_name: 'system.immutable', column_type: 'boolean' },
        { ns: 'system', schema_name: 'system.column', column_name: 'system.indexed', column_type: 'boolean' },
        { ns: 'system', schema_name: 'system.column', column_name: 'system.internal', column_type: 'boolean' },
        { ns: 'system', schema_name: 'system.column', column_name: 'system.required', column_type: 'boolean' },
        { ns: 'system', schema_name: 'system.column', column_name: 'system.unique', column_type: 'boolean' },

        { ns: 'system', schema_name: 'system.column', column_name: 'system.minimum', column_type: 'integer' },
        { ns: 'system', schema_name: 'system.column', column_name: 'system.maximum', column_type: 'integer' },
    ]);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw('DROP SCHEMA IF EXISTS system CASCADE;');
}

