import { Knex } from 'knex';

export default async function(knex: Knex, table_path: string): Promise<void> {
    console.debug('knex-drop-table: %j', table_path);

    await knex.schema.dropTable(table_path);
    await knex.schema.dropTable(table_path + '__meta');
}
