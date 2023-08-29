import { Knex } from 'knex';

export default async function(knex: Knex, table_name: string) {
    await knex.schema.dropTable(table_name + '_acls');
    await knex.schema.dropTable(table_name + '_info');
    await knex.schema.dropTable(table_name);
}
