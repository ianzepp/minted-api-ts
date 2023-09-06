import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // Insert test namespace
    await knex('system').insert({ 'ns': 'test' });
}


export async function down(knex: Knex): Promise<void> {
    // Delete test namespace
    await knex('system').where({ 'ns': 'test' }).delete();
}

