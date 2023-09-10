import _ from 'lodash';
import chai from 'chai';
import { Knex } from 'knex';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { Record } from '../../classes/record';
import { Schema, SchemaType } from '../../classes/schema';

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
        return SchemaType.Schema;
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

            // Delete the base table
            await system.knex.schema.dropTable(schema_name);

            // Explicitly delete the schema data from the local metadata for this execution context
            delete system.meta.schemas[record.data.schema_name];
        }
    }
}
