import _ from 'lodash';
import { Knex } from 'knex';

export function headOne<T>(result: T[]): T | undefined {
    return _.head(result);
}

export function head404<T>(result: T[]): T {
    let r = _.head(result);

    if (r === undefined) {
        throw 404;
    }

    return r;
}

export async function migrationTableUp(knex: Knex, table_name: string) {
    await knex.schema.createTable(table_name, (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('ns');
        table.string('sc');
    });

    await knex.schema.createTable(table_name + '_info', (table) => {
        table.uuid('record_id').primary().references('id').inTable(table_name).onDelete('CASCADE');

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
        table.uuid('record_id').primary().references('id').inTable(table_name).onDelete('CASCADE');

        table.specificType('acls_full', 'uuid ARRAY').index();
        table.specificType('acls_edit', 'uuid ARRAY').index();
        table.specificType('acls_read', 'uuid ARRAY').index();
        table.specificType('acls_deny', 'uuid ARRAY').index();
    });
}

export async function migrationTableDown(knex: Knex, table_name: string) {
    await knex.schema.dropTable(table_name + '_acls');
    await knex.schema.dropTable(table_name + '_info');
    await knex.schema.dropTable(table_name);
}

export async function migrationInsertAll(knex: Knex, table_name: string, record_data: _.Dictionary<any>[]) {
    for(let record of record_data) {
        console.warn('migrationInsert', record);

        let result = _.head(await knex(table_name).insert(record).returning('*'));
        let record_info = await knex(table_name + '_info').insert({ record_id: result.id });
        let record_acls = await knex(table_name + '_acls').insert({ record_id: result.id });

        _.assign(record, result);
    }

    return record_data;
}
