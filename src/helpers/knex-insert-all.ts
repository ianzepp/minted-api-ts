import _ from 'lodash';
import { Knex } from 'knex';

export default async function(knex: Knex, table_name: string, table_rows: _.Dictionary<any>[]): Promise<_.Dictionary<any>> {
    for(let table_data of table_rows) {
        console.debug('knex-insert-all: %j %j', table_name, table_data);

        let result = _.head(await knex('system_data.' + table_name).insert(table_data).returning('*'));
        let result_meta   = await knex('system_meta.' + table_name).insert({ id: result.id, ns: table_data.ns });
        let result_acls   = await knex('system_acls.' + table_name).insert({ id: result.id, ns: table_data.ns });

        _.assign(table_data, result);
    }

    return table_rows;
}