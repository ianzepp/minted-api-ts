import { Knex } from 'knex';

import { migrationInsertAll } from '../classes/helpers';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('column', (table) => {
        table.string('type');
        table.boolean('required').defaultTo(false);
        table.boolean('indexed').defaultTo(false);
        table.boolean('searchable').defaultTo(false);
    });

    await knex('column')
        .where({ ns: 'system' })
        .whereNull('type')
        .update({ type: 'text' });

    await knex.schema.table('column', (table) => {
        table.string('type').notNullable().alter();
    });

    let columns = await migrationInsertAll(knex, 'column', [
        { ns: 'system', schema_name: 'column', column_name: 'required', type: 'boolean', description: 'If true, then this column must have a value' },
        { ns: 'system', schema_name: 'column', column_name: 'indexed', type: 'boolean', description: 'If true, then this column has an index applied at the database level' },
        { ns: 'system', schema_name: 'column', column_name: 'searchable', type: 'boolean' },
        { ns: 'system', schema_name: 'column', column_name: 'type', type: 'string' },
    ]);
}

export async function down(knex: Knex): Promise<void> {
    await knex('column').where({ ns: 'system', schema_name: 'column', column_name: 'required' }).delete();
    await knex('column').where({ ns: 'system', schema_name: 'column', column_name: 'indexed' }).delete();
    await knex('column').where({ ns: 'system', schema_name: 'column', column_name: 'searchable' }).delete();
    await knex('column').where({ ns: 'system', schema_name: 'column', column_name: 'type' }).delete();

    await knex.schema.table('column', (table) => {
        table.dropColumn('required');
        table.dropColumn('indexed');
        table.dropColumn('searchable');
        table.dropColumn('type');
    });
}

