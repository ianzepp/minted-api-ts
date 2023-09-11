import _ from 'lodash';
import { Knex } from 'knex';

import { System } from './system';
import { SystemAsRoot } from './system';

export class AutoInstall {
    public readonly system = new SystemAsRoot();

    get knex() {
        return this.system.knex.db;
    }
    
    async up() {
        // Current database name
        let database_name = this.knex.client.config.connection.database;

        // Add `pgcrypto` so we can create UUIDs in the DB
        await this.knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

        // Create namespace
        await this.knex.raw('CREATE SCHEMA IF NOT EXISTS "system";');
        await this.knex.raw('GRANT USAGE, CREATE ON SCHEMA "system" TO PUBLIC;');

        await this.knex.raw('CREATE SCHEMA IF NOT EXISTS "system__meta";');
        await this.knex.raw('GRANT USAGE, CREATE ON SCHEMA "system__meta" TO PUBLIC;');

        // System table is always visible
        await this.knex.raw(`ALTER DATABASE "${ database_name }" SET search_path TO system, public;`);

        // Start the tx
        await this.knex.raw('BEGIN TRANSACTION;');

        // Save a variable for future use in this tx
        await this.knex.raw(`
            CREATE TEMPORARY TABLE tx_session_data (
                user_id UUID, 
                user_ns TEXT,
                user_ts TIMESTAMP
            );

            INSERT INTO tx_session_data (user_id, user_ns, user_ts) 
            VALUES ('${ System.RootId }', '${ System.RootNs }', CURRENT_TIMESTAMP);
        `)

        // Create the master client table.
        await this.knex.schema.withSchema('system').createTable('client', (table) => {
            table.uuid('id').primary().defaultTo(this.knex.fn.uuid());
            table.string('ns').primary().unique().notNullable();
            table.string('client_name').notNullable();
        });

        // Create the master client data records.
        await this.knex('client').withSchema('system').insert([
            { ns: 'system', client_name: 'Minted API System' },
            { ns: 'test', client_name: 'Minted API Test Runner' },
        ]);

        //
        // Meta definitions
        //

        // Create table `client`

        // Create table `schema`
        await this.tableUp('system', 'schema', (table) => {
            table.string('schema_name').notNullable();
            table.string('schema_type').notNullable().defaultTo('database');
            table.string('description');

            table.boolean('external').defaultTo(false);
            table.boolean('metadata').defaultTo(false);
        });

        // Create table `column`
        await this.tableUp('system', 'column', table => {
            table.string('schema_name').notNullable();
            table.string('column_name').notNullable();
            table.string('column_type').notNullable().defaultTo('text');
            table.string('description');

            table.boolean('audited').defaultTo(false);
            table.boolean('immutable').defaultTo(false);
            table.boolean('indexed').defaultTo(false);
            table.boolean('internal').defaultTo(false);
            table.boolean('required').defaultTo(false);
            table.boolean('unique').defaultTo(false);

            table.integer('minimum');
            table.integer('maximum');
            table.integer('precision');
        });

        // Create table `client_user`
        await this.tableUp('system', 'client_user', table => {
            table.string('name').notNullable();
        });

        //
        // Data inserts
        //

        // Add data for `schema`
        await this.insertAll('system', 'schema', [
            { ns: 'system', schema_name: 'system.schema', schema_type: 'database', metadata: true },
            { ns: 'system', schema_name: 'system.column', schema_type: 'database', metadata: true },
            { ns: 'system', schema_name: 'system.client_user', schema_type: 'database', metadata: false },
        ]);

        // Add data for `column`
        await this.insertAll('system', 'column', [
            // Columns for 'schema'
            { ns: 'system', schema_name: 'system.schema', column_name: 'schema_name' },
            { ns: 'system', schema_name: 'system.schema', column_name: 'metadata', column_type: 'boolean' },

            // Columns for 'column'
            { ns: 'system', schema_name: 'system.column', column_name: 'schema_name', required: true, immutable: true, indexed: true },
            { ns: 'system', schema_name: 'system.column', column_name: 'column_name', required: true, immutable: true, indexed: true },
            { ns: 'system', schema_name: 'system.column', column_name: 'column_type', required: true, immutable: true, indexed: true },

            { ns: 'system', schema_name: 'system.column', column_name: 'audited', column_type: 'boolean' },
            { ns: 'system', schema_name: 'system.column', column_name: 'immutable', column_type: 'boolean' },
            { ns: 'system', schema_name: 'system.column', column_name: 'indexed', column_type: 'boolean' },
            { ns: 'system', schema_name: 'system.column', column_name: 'internal', column_type: 'boolean' },
            { ns: 'system', schema_name: 'system.column', column_name: 'required', column_type: 'boolean' },
            { ns: 'system', schema_name: 'system.column', column_name: 'unique', column_type: 'boolean' },

            { ns: 'system', schema_name: 'system.column', column_name: 'minimum', column_type: 'integer' },
            { ns: 'system', schema_name: 'system.column', column_name: 'maximum', column_type: 'integer' },
            { ns: 'system', schema_name: 'system.column', column_name: 'precision', column_type: 'integer' },

            // Columns for 'user'
            { ns: 'system', schema_name: 'system.client_user', column_name: 'name', column_type: 'text' },
        ]);

        // Add data for `client_user`
        await this.insertAll('system', 'client_user', [
            { ns: System.RootNs, id: System.RootId, name: 'root' },
            { ns: System.TestNs, id: System.TestId, name: 'test' },
        ]);

        // Commit the transaction
        await this.knex.raw('COMMIT;');
    }

    //
    // Helpers
    //

    async tableUp(namespace: string, schema_name: string, columnFn: (table: Knex.CreateTableBuilder) => void): Promise<void> {
        console.warn('autoinstall.tableUp()', namespace, schema_name);

        let schema_path = [namespace, schema_name].join('.');

        // Data table
        await this.knex.schema.withSchema(namespace).createTable(schema_name, (table) => {
            table.uuid('id').primary().defaultTo(this.knex.fn.uuid());
            table.string('ns').references('ns').inTable('system.client').onDelete('CASCADE');

            // Apply extra columns
            columnFn(table);
        });
    
        // Meta table
        await this.knex.schema.withSchema(namespace + '__meta').createTable(schema_name, (table) => {
            table.uuid('id').primary().references('id').inTable(schema_path).onDelete('CASCADE');
            table.string('ns'); // parent data has an index to the client ns
    
            table.timestamp('created_at').index();
            table.uuid('created_by').index();

            table.timestamp('updated_at').index();
            table.uuid('updated_by').index();

            table.timestamp('expired_at').index();
            table.uuid('expired_by').index();

            table.timestamp('deleted_at').index();
            table.uuid('deleted_by').index();

            table.specificType('acls_full', 'uuid ARRAY').index();
            table.specificType('acls_edit', 'uuid ARRAY').index();
            table.specificType('acls_read', 'uuid ARRAY').index();
            table.specificType('acls_deny', 'uuid ARRAY').index();
        });

        //
        // Auto-insert metadata table
        //

        await this.knex.raw(`
            -- Define a trigger to auto-insert a metadata table
            CREATE OR REPLACE FUNCTION ${namespace}__${schema_name}_insert_meta_function()
            RETURNS TRIGGER AS $$
            DECLARE
                temp_user_id UUID;
                temp_user_ts TIMESTAMP;
            BEGIN
                -- Find the current session vars
                SELECT COALESCE(user_id, '00000000-0000-0000-0000-000000000000'), COALESCE(user_ts, CURRENT_TIMESTAMP)
                  INTO temp_user_id, temp_user_ts 
                  FROM tx_session_data
                 LIMIT 1;
        
                -- Create the meta data
                INSERT INTO "${namespace}__meta"."${schema_name}" (id, ns, created_at, created_by)
                VALUES (NEW.id, NEW.ns, temp_user_ts, temp_user_id);
                
                -- Done
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        
            CREATE TRIGGER ${namespace}__${schema_name}_insert_meta_trigger 
            AFTER INSERT ON "${namespace}"."${schema_name}"
            FOR EACH ROW
            EXECUTE PROCEDURE ${namespace}__${schema_name}_insert_meta_function();
        `);
    }

    async insertAll(namespace: string, schema_name: string, record_rows: _.Dictionary<any>[]) {
        console.warn('autoinstall.insertAll()', namespace, schema_name);

        for(let record_data of record_rows) {
            console.warn('+', JSON.stringify(record_data));

            let result = _.head(await this.knex(schema_name).withSchema(namespace).insert(record_data).returning('*'));
            // let result_meta   = await this.knex(schema_meta).withSchema(namespace).insert({ id: result.id, ns: namespace });
        }
    }
}
