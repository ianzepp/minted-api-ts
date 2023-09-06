import { Knex } from 'knex';

export default async function(knex: Knex, table_name: string) {
    await knex.schema.createTable(table_name, (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('ns').references('ns').inTable('system').onDelete('CASCADE');
    });

    await knex.schema.createTable(table_name + '_info', (table) => {
        table.uuid('id').primary().references('id').inTable(table_name).onDelete('CASCADE');
        table.string('ns').references('ns').inTable('system').onDelete('CASCADE');

        table.timestamp('created_at').index();
        table.timestamp('updated_at').index();
        table.timestamp('expired_at').index();
        table.timestamp('deleted_at').index();

        table.uuid('created_by').index();
        table.uuid('updated_by').index();
        table.uuid('expired_by').index();
        table.uuid('deleted_by').index();
    });

    await knex.schema.createTable(table_name + '_acls', (table) => {
        table.uuid('id').primary().references('id').inTable(table_name).onDelete('CASCADE');
        table.string('ns').references('ns').inTable('system').onDelete('CASCADE');

        table.specificType('acls_full', 'uuid ARRAY').index();
        table.specificType('acls_edit', 'uuid ARRAY').index();
        table.specificType('acls_read', 'uuid ARRAY').index();
        table.specificType('acls_deny', 'uuid ARRAY').index();
    });

    await knex.schema.createTable(table_name + '_logs', (table) => {
        table.uuid('id').primary().references('id').inTable(table_name).onDelete('CASCADE');
        table.string('ns').references('ns').inTable('system').onDelete('CASCADE');

        table.timestamp('changed_at').index();
        table.uuid('changed_by').index();
        table.specificType('changed', 'jsonb');
    });
}