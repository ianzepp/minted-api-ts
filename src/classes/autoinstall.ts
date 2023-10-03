import _ from 'lodash';
import { Knex } from 'knex';

import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';
import { ObjectType } from '@typedefs/object';

export class AutoInstall {
    constructor(public readonly kernel: Kernel = new Tester()) {}

    get knex() {
        return this.kernel.data.driver;
    }
    
    async up() {
        // Current database name
        let dn = this.knex.client.config.connection.database;

        // Start the tx
        await this.knex.raw('BEGIN TRANSACTION;');

        // Create the master domain table.
        await this.createTable(ObjectType.Domain, (table) => {
            table.string('name').notNullable();

            // Unique index on (ns)
            table.unique(['ns']);
        });

        // Create the master domain record.
        await this.insertAll(ObjectType.Domain, [
            { ns: 'system', name: 'Minted API System' },
            { ns: 'test', name: 'Minted API Test Suite' },
        ]);

        //
        // Meta definitions
        //

        // Create table `object`
        await this.createTable(ObjectType.Object, (table) => {
            table.string('name').notNullable();
            table.string('type').notNullable().defaultTo('database');
            table.string('description');

            table.boolean('external').defaultTo(false);
            table.boolean('metadata').defaultTo(false);

            // Compound index on (ns, name)
            table.unique(['ns', 'name']);
        });

        // Create table `column`
        await this.createTable(ObjectType.Column, table => {
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
        await this.createTable(ObjectType.Test, table => {
            table.string('name').notNullable();
            table.boolean('boolean');
            table.integer('integer');
            table.decimal('decimal');
        });

        // Create table `user`
        await this.createTable(ObjectType.User, table => {
            table.string('name').notNullable();
        });

        // Create table `config`
        await this.createTable(ObjectType.Config, table => {
            table.string('name').notNullable();
            table.string('data').notNullable();
        });

        //
        // Data inserts
        //

        // Add data for `object`
        await this.insertAll(ObjectType.Object, [
            { ns: 'system', name: ObjectType.Domain, type: 'database' },
            { ns: 'system', name: ObjectType.Object, type: 'database', metadata: true },
            { ns: 'system', name: ObjectType.Column, type: 'database', metadata: true },
            { ns: 'system', name: ObjectType.Test, type: 'database' },
            { ns: 'system', name: ObjectType.User, type: 'database' },
            { ns: 'system', name: ObjectType.Config, type: 'database' },
        ]);

        // Add data for `column`
        await this.insertAll(ObjectType.Column, [
            // Columns for 'system'
            { ns: 'system', name: ObjectType.Domain + '.name', required: true },

            // Columns for 'object'
            { ns: 'system', name: ObjectType.Object + '.name', required: true, immutable: true, indexed: true  },
            { ns: 'system', name: ObjectType.Object + '.type' },
            { ns: 'system', name: ObjectType.Object + '.description' },
            { ns: 'system', name: ObjectType.Object + '.external', type: 'boolean' },
            { ns: 'system', name: ObjectType.Object + '.metadata', type: 'boolean' },

            // Columns for 'column'
            { ns: 'system', name: ObjectType.Column + '.name', required: true, immutable: true, indexed: true },
            { ns: 'system', name: ObjectType.Column + '.type', required: true },
            { ns: 'system', name: ObjectType.Column + '.description' },

            { ns: 'system', name: ObjectType.Column + '.audited', type: 'boolean' },
            { ns: 'system', name: ObjectType.Column + '.immutable', type: 'boolean' },
            { ns: 'system', name: ObjectType.Column + '.indexed', type: 'boolean' },
            { ns: 'system', name: ObjectType.Column + '.internal', type: 'boolean' },
            { ns: 'system', name: ObjectType.Column + '.required', type: 'boolean' },
            { ns: 'system', name: ObjectType.Column + '.unique', type: 'boolean' },

            { ns: 'system', name: ObjectType.Column + '.minimum', type: 'integer' },
            { ns: 'system', name: ObjectType.Column + '.maximum', type: 'integer' },
            { ns: 'system', name: ObjectType.Column + '.precision', type: 'integer' },

            // Columns for 'test'
            { ns: 'system', name: ObjectType.Test + '.name', type: 'text', required: true },
            { ns: 'system', name: ObjectType.Test + '.boolean', type: 'boolean' },
            { ns: 'system', name: ObjectType.Test + '.integer', type: 'integer' },
            { ns: 'system', name: ObjectType.Test + '.decimal', type: 'decimal' },

            // Columns for 'user'
            { ns: 'system', name: ObjectType.User + '.name', type: 'text', required: true },

            // Columns for 'config'
            { ns: 'system', name: ObjectType.Config + '.name', type: 'text', required: true },
            { ns: 'system', name: ObjectType.Config + '.data', type: 'text', required: true },
        ]);

        // Add data for `client`
        await this.insertAll(ObjectType.User, [
            { ns: Kernel.NS, id: Kernel.ID, name: 'root' },
            { ns: Tester.NS, id: Tester.ID, name: 'test' },
        ]);

        // Commit the transaction
        await this.knex.raw('COMMIT;');
    }

    //
    // Helpers
    //

    async createTable(object_path: string, columnFn: (table: Knex.CreateTableBuilder) => void): Promise<void> {
        if (this.kernel.isTest() === false) {
            console.warn('autoinstall.createTable()', object_path);
        }

        // Data table
        await this.knex.schema.createTable(object_path, (table) => {
            table.string('id').notNullable().primary();
            table.string('ns').notNullable();

            // Apply extra columns
            columnFn(table);
        });

        await this.knex.schema.createTable(object_path + '::meta', (table) => {
            table.string('id').notNullable().primary();
            table.string('ns').notNullable();

            table.timestamp('created_at').index();
            table.string('created_by').index();

            table.timestamp('updated_at').index();
            table.string('updated_by').index();

            table.timestamp('expired_at').index();
            table.string('expired_by').index();

            table.timestamp('deleted_at').index();
            table.string('deleted_by').index();
        });

        await this.knex.schema.createTable(object_path + '::acls', (table) => {
            table.string('id').notNullable().primary();
            table.string('ns').notNullable();

            table.specificType('access_full', 'text ARRAY');
            table.specificType('access_edit', 'text ARRAY');
            table.specificType('access_read', 'text ARRAY');
            table.specificType('access_deny', 'text ARRAY');
        });

        // await this.knex.schema.createTable(object_path + '::acls', (table) => {
        //     table.string('id').notNullable().primary();

        //     table.specificType('access_full', 'text ARRAY');
        //     table.specificType('access_edit', 'text ARRAY');
        //     table.specificType('access_read', 'text ARRAY');
        //     table.specificType('access_deny', 'text ARRAY');
        // });
    }

    async deleteTable(object_path: string) {
        if (this.kernel.isTest() === false) {
            console.warn('autoinstall.deleteTable()', object_path);
        }

        await this.knex.schema.dropTable(object_path + '::acls');
        await this.knex.schema.dropTable(object_path + '::meta');
        await this.knex.schema.dropTable(object_path + '::data');
    }

    //
    // Helpers
    //

    async insertAll(object_path: string, record_rows: _.Dictionary<any>[]) {
        if (this.kernel.isTest() === false) {
            console.warn('autoinstall.insertAll()', object_path);
        }

        // Process
        for(let record_data of record_rows) {
            console.warn('+', JSON.stringify(record_data));

            // Assign UUID
            record_data.id = this.kernel.uuid();

            // Insert record
            await this.knex(object_path).insert(record_data);

            // Insert record::meta
            await this.knex(object_path + '::meta').insert({
                id: record_data.id,
                ns: record_data.ns,
                created_at: new Date().toISOString(),
                created_by: Kernel.ID,
            });
        }
    }
}
