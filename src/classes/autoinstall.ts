import _ from 'lodash';
import { Knex } from 'knex';

import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';
import { SchemaType } from '@typedefs/schema';

export class AutoInstall {
    constructor(public readonly kernel: Kernel = new Tester()) {}

    get knex() {
        return this.kernel.knex.driver;
    }
    
    async up() {
        // Current database name
        let dn = this.knex.client.config.connection.database;

        // Add `pgcrypto` so we can create UUIDs in the DB
        await this.knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

        // Start the tx
        await this.knex.raw('BEGIN TRANSACTION;');

        // // Set user vars
        // await this.knex.raw(`
        //     SET LOCAL minted.userinfo_id = '${ this.kernel.user_id }';
        //     SET LOCAL minted.userinfo_ns = '${ this.kernel.user_ns }';
        //     SET LOCAL minted.userinfo_ts = '${ this.kernel.timeISO() }';
        // `);

        // // Create the userinfo scopes function
        // await this.knex.raw(`
        //     CREATE OR REPLACE FUNCTION get_userinfo_ns_read() 
        //     RETURNS text[] AS $$
        //     BEGIN
        //         RETURN string_to_array(current_setting('minted.userinfo_ns_read'), ',');
        //     END;
        //     $$ LANGUAGE plpgsql;
        // `);

        // Create the master domain table.
        await this.createTable(SchemaType.Domain, (table) => {
            table.string('description').notNullable();

            // Unique index on (ns)
            table.unique(['ns']);
        });

        // Create the master domain record.
        await this.insertAll(SchemaType.Domain, [
            { ns: 'system', description: 'Minted API System' },
        ]);

        // //
        // // Define the trigger that adds new schemas when a new client is created.
        // //
        // await this.knex.raw(`
        //     CREATE OR REPLACE FUNCTION new_domain_create_schemas_trigger()
        //     RETURNS TRIGGER AS $$
        //     BEGIN
        //         EXECUTE 'CREATE SCHEMA IF NOT EXISTS "' || NEW.ns || '__data";';
        //         EXECUTE 'CREATE SCHEMA IF NOT EXISTS "' || NEW.ns || '__meta";';
                
        //         RETURN NEW;
        //     END;
        //     $$ LANGUAGE plpgsql;

        //     CREATE TRIGGER new_domain_create_schemas
        //     AFTER INSERT ON "system__data"."domain"
        //     FOR EACH ROW
        //     EXECUTE PROCEDURE new_domain_create_schemas_trigger();
        // `);
        
        // Create the master test domain record. This tests that the trigger works.
        await this.insertAll(SchemaType.Domain, [
            { ns: 'test', description: 'Minted API Test Suite' },
        ]);

        //
        // Meta definitions
        //

        // Create table `schema`
        await this.createTable(SchemaType.Schema, (table) => {
            table.string('name').notNullable();
            table.string('type').notNullable().defaultTo('database');
            table.string('description');

            table.boolean('external').defaultTo(false);
            table.boolean('metadata').defaultTo(false);

            // Compound index on (ns, name)
            table.unique(['ns', 'name']);
        });

        // Create table `column`
        await this.createTable(SchemaType.Column, table => {
            table.string('name').notNullable();
            table.string('type').notNullable().defaultTo('text');
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

            // Compound index on (ns, name)
            table.unique(['ns', 'name']);
        });

        // Create table `test`
        await this.createTable(SchemaType.Test, table => {
            table.string('name').notNullable();
            table.boolean('boolean');
            table.integer('integer');
            table.decimal('decimal');
        });

        // Create table `user`
        await this.createTable(SchemaType.User, table => {
            table.string('name').notNullable();
        });

        //
        // Data inserts
        //

        // Add data for `schema`
        await this.insertAll(SchemaType.Schema, [
            { ns: 'system', name: SchemaType.Domain, type: 'database' },
            { ns: 'system', name: SchemaType.Schema, type: 'database', metadata: true },
            { ns: 'system', name: SchemaType.Column, type: 'database', metadata: true },
            { ns: 'system', name: SchemaType.Test, type: 'database' },
            { ns: 'system', name: SchemaType.User, type: 'database' },
        ]);

        // Add data for `column`
        await this.insertAll(SchemaType.Column, [
            // Columns for 'system'
            { ns: 'system', name: SchemaType.Domain + '#description' },

            // Columns for 'schema'
            { ns: 'system', name: SchemaType.Schema + '#name', required: true, immutable: true, indexed: true  },
            { ns: 'system', name: SchemaType.Schema + '#type' },
            { ns: 'system', name: SchemaType.Schema + '#description' },
            { ns: 'system', name: SchemaType.Schema + '#external', type: 'boolean' },
            { ns: 'system', name: SchemaType.Schema + '#metadata', type: 'boolean' },

            // Columns for 'column'
            { ns: 'system', name: SchemaType.Column + '#name', required: true, immutable: true, indexed: true },
            { ns: 'system', name: SchemaType.Column + '#type', required: true },
            { ns: 'system', name: SchemaType.Column + '#description' },

            { ns: 'system', name: SchemaType.Column + '#audited', type: 'boolean' },
            { ns: 'system', name: SchemaType.Column + '#immutable', type: 'boolean' },
            { ns: 'system', name: SchemaType.Column + '#indexed', type: 'boolean' },
            { ns: 'system', name: SchemaType.Column + '#internal', type: 'boolean' },
            { ns: 'system', name: SchemaType.Column + '#required', type: 'boolean' },
            { ns: 'system', name: SchemaType.Column + '#unique', type: 'boolean' },

            { ns: 'system', name: SchemaType.Column + '#minimum', type: 'integer' },
            { ns: 'system', name: SchemaType.Column + '#maximum', type: 'integer' },
            { ns: 'system', name: SchemaType.Column + '#precision', type: 'integer' },

            // Columns for 'test'
            { ns: 'system', name: SchemaType.Test + '#name', type: 'text', required: true },
            { ns: 'system', name: SchemaType.Test + '#boolean', type: 'boolean' },
            { ns: 'system', name: SchemaType.Test + '#integer', type: 'integer' },
            { ns: 'system', name: SchemaType.Test + '#decimal', type: 'decimal' },

            // Columns for 'user'
            { ns: 'system', name: SchemaType.User + '#name', type: 'text', required: true },
        ]);

        // Add data for `client`
        await this.insertAll(SchemaType.User, [
            { ns: Kernel.NS, id: Kernel.ID, name: 'root' },
            { ns: Tester.NS, id: Tester.ID, name: 'test' },
        ]);

        // Commit the transaction
        await this.knex.raw('COMMIT;');
    }

    //
    // Helpers
    //

    async createTable(schema_path: string, columnFn: (table: Knex.CreateTableBuilder) => void): Promise<void> {
        if (this.kernel.isTest() === false) {
            console.warn('autoinstall.createTable()', schema_path);
        }

        // Data table
        await this.knex.schema.createTable(schema_path + '/data', (table) => {
            table.string('id').notNullable().primary().defaultTo(this.knex.fn.uuid());
            table.string('ns').notNullable();

            // Apply extra columns
            columnFn(table);
        });

        await this.knex.schema.createTable(schema_path + '/meta', (table) => {
            table.string('id').notNullable().primary();
            table.string('ns').notNullable();

            // Metadata
            table.timestamp('created_at').index();
            table.timestamp('updated_at').index();
            table.timestamp('expired_at').index();
            table.timestamp('deleted_at').index();

            table.string('created_by').index();
            table.string('updated_by').index();
            table.string('expired_by').index();
            table.string('deleted_by').index();

            // ACLs
            table.specificType('acls_full', 'text ARRAY');
            table.specificType('acls_edit', 'text ARRAY');
            table.specificType('acls_read', 'text ARRAY');
            table.specificType('acls_deny', 'text ARRAY');
        });
    
        // //
        // // Row level security
        // // 

        // await this.knex.raw(`
        //     ALTER TABLE "${ns}__meta"."${sn}" ENABLE ROW LEVEL SECURITY;

        //     CREATE POLICY ${ns}_${sn}_rls_policy ON "${ns}__meta"."${sn}"
        //     USING (
        //         (
        //             (acls_deny IS NULL) OR 
        //             (NOT acls_deny @> ARRAY[current_setting('minted.userinfo_id')]::uuid[])
        //         ) AND (
        //             (acls_full @> ARRAY[current_setting('minted.userinfo_id')]::uuid[]) OR
        //             (acls_edit @> ARRAY[current_setting('minted.userinfo_id')]::uuid[]) OR
        //             (acls_read @> ARRAY[current_setting('minted.userinfo_id')]::uuid[]) OR
        //             (acls_full IS NULL AND acls_edit IS NULL AND acls_read IS NULL)
        //         )
        //     );
        // `);

        // //
        // // Auto-insert metadata table
        // //

        // await this.knex.raw(`
        //     -- Define a trigger to auto-insert a metadata table
        //     CREATE OR REPLACE FUNCTION ${ns}_${sn}_insert_meta_function()
        //     RETURNS TRIGGER AS $$
        //     DECLARE
        //         temp_user_id uuid;
        //         temp_user_ts timestamp;
        //     BEGIN
        //         temp_user_id := current_setting('minted.userinfo_id')::uuid;
        //         temp_user_ts := current_setting('minted.userinfo_ts')::timestamp;
                
        //         INSERT INTO "${ns}__meta"."${sn}" (id, ns, created_at, created_by)
        //         VALUES (NEW.id, NEW.ns, temp_user_ts, temp_user_id);
                
        //         -- Done
        //         RETURN NEW;
        //     END;
        //     $$ LANGUAGE plpgsql;
        
        //     CREATE TRIGGER ${ns}_${sn}_insert_meta_trigger 
        //     AFTER INSERT ON "${ns}__data"."${sn}"
        //     FOR EACH ROW
        //     EXECUTE PROCEDURE ${ns}_${sn}_insert_meta_function();
        // `);
    }

    async deleteTable(schema_path: string) {
        if (this.kernel.isTest() === false) {
            console.warn('autoinstall.deleteTable()', schema_path);
        }

        await this.knex.schema.dropTable(schema_path);
    }

    //
    // Helpers
    //

    async insertAll(schema_path: string, record_rows: _.Dictionary<any>[]) {
        if (this.kernel.isTest() === false) {
            console.warn('autoinstall.insertAll()', schema_path);
        }

        // Process
        for(let record_data of record_rows) {
            console.warn('+', JSON.stringify(record_data));
            
            // Assign ID
            let [data] = await this.knex(schema_path + '/data').insert(record_data).returning('*');
            let [meta] = await this.knex(schema_path + '/meta').insert({ 
                id: data.id,
                ns: data.ns,
                created_at: new Date().toISOString(),
                created_by: Kernel.ID,
            }).returning('*');
        }
    }
}
