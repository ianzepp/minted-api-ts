import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { KnexDriver } from '../../classes/knex';
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { Record } from '../../classes/record';
import { Schema } from '../../classes/schema';

// Layouts
import { ObserverRing } from '../../layouts/observer';

// Helpers
import knexCreateTable from '../../helpers/knex-create-table';

/**
 * This class extends the Observer class and provides methods for creating a schema in Knex.
 * 
 * It is responsible for calling the `knex.schema` interface and creating the actual 
 * table structures in the database, including:
 * - the `<schema_name>` base table
 * - the `<schema_name>_info` table
 * - the `<schema_name>_acls` table
 * - the `<schema_name>_logs` table
 * 
 * @class
 * @extends {Observer}
 */

export default class extends Observer {
    toName(): string {
        return 'schema.delete-tables';
    }
    
    onSchema(): string {
        return 'schema';
    }

    onRing(): ObserverRing {
        return ObserverRing.Post;
    }

    onDelete(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        for(let record of flow.change) {
            let system = flow.system;
            let schema_name = record.data.schema_name;

            // Create base table
            await system.knex.schema.dropTable('system_acls.' + schema_name);
            await system.knex.schema.dropTable('system_meta.' + schema_name);
            await system.knex.schema.dropTable('system_data.' + schema_name);
        }
    }
}
