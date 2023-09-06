import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('column', (table) => {
        table.specificType('enums', 'varchar(64)[]');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('column', (table) => {
        table.dropColumn('enums');
    });
}

