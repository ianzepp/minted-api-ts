import { Knex } from 'knex';

export default async function(knex: Knex, table_name: string): Promise<void> {
    await knex.schema.dropTable(table_name + '_acls');
    await knex.schema.dropTable(table_name + '_info');
    await knex.schema.dropTable(table_name + '_logs');
    await knex.schema.dropTable(table_name);
}
