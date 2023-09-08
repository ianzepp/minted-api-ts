import { Knex } from 'knex';

export default async function(knex: Knex, table_name: string): Promise<void> {
    await knex.schema.dropTable('system_acls.' + table_name);
    await knex.schema.dropTable('system_meta.' + table_name);
    await knex.schema.dropTable('system_data.' + table_name);
}
