import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('column', (table) => {
        table.specificType('enums', 'varchar(64)[]');
    });

    await knex('column').insert([
        { ns: 'system', schema_name: 'column', column_name: 'enums', type: 'enum' },
    ]);
}


export async function down(knex: Knex): Promise<void> {
    await knex('column').where({ ns: 'system', schema_name: 'column', column_name: 'enums' }).delete();

    await knex.schema.table('column', (table) => {
        table.dropColumn('enums');
    });
}

