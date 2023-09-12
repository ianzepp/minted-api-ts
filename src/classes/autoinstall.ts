import _ from 'lodash';
import { Knex } from 'knex';

import { System } from '@classes/system';
import { SystemAsRoot } from '@classes/system';

export class AutoInstall {
    constructor(public readonly system: System = new SystemAsRoot()) {}

    get knex() {
        return this.system.knex.driver;
    }
    
    async up() {
        // Current database name
        let dn = this.knex.client.config.connection.database;

        // Add `pgcrypto` so we can create UUIDs in the DB
        await this.knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

        // Create namespace for `system`
        await this.knex.raw('CREATE SCHEMA IF NOT EXISTS "system__data";');
        await this.knex.raw('GRANT USAGE, CREATE ON SCHEMA "system__data" TO PUBLIC;');

        await this.knex.raw('CREATE SCHEMA IF NOT EXISTS "system__meta";');
        await this.knex.raw('GRANT USAGE, CREATE ON SCHEMA "system__meta" TO PUBLIC;');

        // System table is always visible
        await this.knex.raw(`ALTER DATABASE "${dn}" SET search_path TO system__data, system__meta;`);

        // Start the tx
        await this.knex.raw('BEGIN TRANSACTION;');

        await this.knex.raw(`
            SET LOCAL minted.current_user_id = '${ this.system.user_id }';
            SET LOCAL minted.current_user_ns = '${ this.system.user_ns }';
            SET LOCAL minted.current_user_ts = '${ this.system.time_iso }';
        `);

        // Create the master system table.
        await this.createTable('system.system', (table) => {
            table.string('client_name').notNullable();
        });

        // Create the master system record.
        await this.insertAll('system.system', [
            { ns: 'system', client_name: 'Minted API System' },
        ]);

        //
        // Define the trigger that adds new schemas when a new client is created.
        //
        await this.knex.raw(`
            CREATE OR REPLACE FUNCTION new_system_create_schema_trigger()
            RETURNS TRIGGER AS $$
            BEGIN
                EXECUTE 'CREATE SCHEMA IF NOT EXISTS "' || NEW.ns || '__data";';
                EXECUTE 'CREATE SCHEMA IF NOT EXISTS "' || NEW.ns || '__meta";';
                
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER new_system_create_schema
            AFTER INSERT ON "system__data"."system"
            FOR EACH ROW
            EXECUTE PROCEDURE new_system_create_schema_trigger();
        `);
        
        // Create the master test system record. This tests that the trigger works.
        await this.insertAll('system.system', [
            { ns: 'test', client_name: 'Minted API System Tests' },
        ]);

        //
        // Meta definitions
        //

        // Create table `schema`
        await this.createTable('system.schema', (table) => {
            table.string('schema_name').notNullable();
            table.string('schema_type').notNullable().defaultTo('database');
            table.string('description');

            table.boolean('external').defaultTo(false);
            table.boolean('metadata').defaultTo(false);
        });

        // Create table `column`
        await this.createTable('system.column', table => {
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
        await this.createTable('system.client', table => {
            table.string('name').notNullable();
        });

        //
        // Data inserts
        //

        // Add data for `schema`
        await this.insertAll('system.schema', [
            { ns: 'system', schema_name: 'system.schema', schema_type: 'database', metadata: true },
            { ns: 'system', schema_name: 'system.column', schema_type: 'database', metadata: true },
            { ns: 'system', schema_name: 'system.client', schema_type: 'database', metadata: false },
        ]);

        // Add data for `column`
        await this.insertAll('system.column', [
            // Columns for 'schema'
            { ns: 'system', schema_name: 'system.schema', column_name: 'schema_name', required: true },
            { ns: 'system', schema_name: 'system.schema', column_name: 'schema_type' },
            { ns: 'system', schema_name: 'system.schema', column_name: 'description' },
            { ns: 'system', schema_name: 'system.schema', column_name: 'external', column_type: 'boolean' },
            { ns: 'system', schema_name: 'system.schema', column_name: 'metadata', column_type: 'boolean' },

            // Columns for 'column'
            { ns: 'system', schema_name: 'system.column', column_name: 'schema_name', required: true, immutable: true, indexed: true },
            { ns: 'system', schema_name: 'system.column', column_name: 'column_name', required: true, immutable: true, indexed: true },
            { ns: 'system', schema_name: 'system.column', column_name: 'column_type', required: true, immutable: true, indexed: true },
            { ns: 'system', schema_name: 'system.column', column_name: 'description' },

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
            { ns: 'system', schema_name: 'system.client', column_name: 'name', column_type: 'text' },
        ]);

        // Add data for `client_user`
        await this.insertAll('system.client', [
            { ns: System.RootNs, id: System.RootId, name: 'root' },
            { ns: System.TestNs, id: System.TestId, name: 'test' },
        ]);

        // Commit the transaction
        await this.knex.raw('COMMIT;');
    }

    //
    // Helpers
    //

    async createTable(schema_path: string, columnFn: (table: Knex.CreateTableBuilder) => void): Promise<void> {
        if (this.system.isTest() === false) {
            console.warn('autoinstall.createTable()', schema_path);
        }

        let [ns, sn] = schema_path.split('.');

        // Data table
        await this.knex.schema.withSchema(ns + '__data').createTable(sn, (table) => {
            table.uuid('id').primary().notNullable().defaultTo(this.knex.fn.uuid());

            // Only applies to the very first one
            if (schema_path === 'system.system') {
                table.string('ns').notNullable().unique();
            }

            else {
                table.string('ns').notNullable().references('ns').inTable('system__data.system').onDelete('CASCADE');
            }

            // Apply extra columns
            columnFn(table);
        });
    
        // Meta table
        await this.knex.schema.withSchema(ns + '__meta').createTable(sn, (table) => {
            table.uuid('id').primary().references('id').inTable(`${ns}__data.${sn}`).onDelete('CASCADE');
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
            CREATE OR REPLACE FUNCTION ${ns}_${sn}_insert_meta_function()
            RETURNS TRIGGER AS $$
            DECLARE
                temp_user_id uuid;
                temp_user_ts timestamp;
            BEGIN
                temp_user_id := current_setting('minted.current_user_id')::uuid;
                temp_user_ts := current_setting('minted.current_user_ts')::timestamp;
                
                INSERT INTO "${ns}__meta"."${sn}" (id, ns, created_at, created_by)
                VALUES (NEW.id, NEW.ns, temp_user_ts, temp_user_id);
                
                -- Done
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        
            CREATE TRIGGER ${ns}_${sn}_insert_meta_trigger 
            AFTER INSERT ON "${ns}__data"."${sn}"
            FOR EACH ROW
            EXECUTE PROCEDURE ${ns}_${sn}_insert_meta_function();
        `);
    }

    async deleteTable(schema_path: string) {
        if (this.system.isTest() === false) {
            console.warn('autoinstall.deleteTable()', schema_path);
        }

        let [ns, sn] = schema_path.split('.');

        await this.knex.schema.withSchema(ns + '__meta').dropTable(sn);
        await this.knex.schema.withSchema(ns + '__data').dropTable(sn);
    }

    //
    // Helpers
    //

    async insertAll(schema_path: string, record_rows: _.Dictionary<any>[]) {
        if (this.system.isTest() === false) {
            console.warn('autoinstall.insertAll()', schema_path);
        }

        let [ns, sn] = schema_path.split('.');

        for(let record_data of record_rows) {
            console.warn('+', JSON.stringify(record_data));
            await this.knex(sn).withSchema(`${ns}__data`).insert(record_data);
        }
    }
}
