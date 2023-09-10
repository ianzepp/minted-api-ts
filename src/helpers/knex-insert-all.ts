import _ from 'lodash';
import { Knex } from 'knex';

export default async function(knex: Knex, table_path: string, table_rows: _.Dictionary<any>[]): Promise<_.Dictionary<any>> {
    for(let table_data of table_rows) {
        console.debug('knex-insert-all: %j %j', table_path, table_data);

        let result = _.head(await knex(table_path).insert(table_data).returning('*'));
        // let result_meta   = await knex(table_path + '__meta').insert({ id: result.id, ns: table_data.ns });

        _.assign(table_data, result);
    }

    return table_rows;
}