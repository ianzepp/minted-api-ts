import { Knex } from 'knex';

export default async function(knex: Knex, table_name: string): Promise<void> {
    console.debug('knex-create-table: %j', table_name);

    // Data table
    await knex.schema.withSchema('system_data').createTable(table_name, (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('ns').references('ns').inTable('system_data.master').onDelete('CASCADE');
    });

    // Meta table
    await knex.schema.withSchema('system_meta').createTable(table_name, (table) => {
        table.uuid('id').primary().references('id').inTable('system_data.' + table_name).onDelete('CASCADE');
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

    await knex.schema.withSchema('system_acls').createTable(table_name, (table) => {
        table.uuid('id').primary().references('id').inTable('system_data.' + table_name).onDelete('CASCADE');
        table.string('ns');

        table.specificType('acls_full', 'uuid ARRAY').index();
        table.specificType('acls_edit', 'uuid ARRAY').index();
        table.specificType('acls_read', 'uuid ARRAY').index();
        table.specificType('acls_deny', 'uuid ARRAY').index();
    });

    // await knex.schema.withSchema(schema_ns).createTable(schema_name + '_logs', (table) => {
    //     table.uuid('id').primary().references('id').inTable(schema_path).onDelete('CASCADE');
    //     table.string('ns').notNullable().references('ns').inTable('system.namespaces').onDelete('CASCADE');

    //     table.timestamp('changed_at').index();
    //     table.uuid('changed_by').index();
    //     table.specificType('changed', 'jsonb');
    // });
}