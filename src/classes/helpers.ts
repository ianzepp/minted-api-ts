import _ from 'lodash';
import { Knex } from 'knex';

export async function migrationInsertAll(knex: Knex, table_name: string, record_data: _.Dictionary<any>[]) {
    for(let record of record_data) {
        console.warn('migrationInsert', record);

        let result = _.head(await knex(table_name).insert(record).returning('*'));
        let record_info = await knex(table_name + '_info').insert({ id: result.id });
        let record_acls = await knex(table_name + '_acls').insert({ id: result.id });

        _.assign(record, result);
    }

    return record_data;
}
