import _ from 'lodash';
import { Knex } from 'knex';

import { Kernel } from '@classes/kernel';
import { ObjectType } from '@typedefs/object';

// Import table functions
import { createTable, deleteTable, insertAll } from './knex';

// Import preloads
import MetadataImports from '@loaders/imports';
import { RecordJson } from '../typedefs/record';

export class AutoInstall {
    constructor(public readonly kernel: Kernel = new Kernel()) {}

    get knex() {
        return this.kernel.data.driver;
    }

    async deleteAll() {
        const tables = await this.knex.raw("SELECT tablename FROM pg_tables WHERE schemaname='public';");

        for (let table of tables.rows) {
            await deleteTable(this.knex, table.tablename);
        }
    }

    async createSystem() {
        // Create table `object`
        await createTable(this.knex, ObjectType.Object, (table) => {
            table.string('type').notNullable().defaultTo('database');
            table.string('description');

            table.boolean('external').defaultTo(false);
            table.boolean('metadata').defaultTo(false);

            // Compound index on (ns, name)
            table.unique(['ns', 'name']);
        });

        // Create table `column`
        await createTable(this.knex, ObjectType.Column, table => {
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

        // Add system data for `object`
        await insertAll(this.knex, ObjectType.Object, [
            { ns: 'system', name: ObjectType.Object, metadata: true },
            { ns: 'system', name: ObjectType.Column, metadata: true },
        ]);    

        await insertAll(this.knex, ObjectType.Column, [
           // Columns for 'object'
           { ns: 'system', name: ObjectType.Object + '.name', required: true, immutable: true, indexed: true  },
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
       ]);
    }

    async importObject(object_name: string) {
        console.info(`importObject(${ object_name })..`);

        let object_json = _.find(MetadataImports, json => {
            return _.get(json, 'type') === 'object'
                && _.get(json, 'data.name') === object_name;
        }) as RecordJson;

        let column_json = _.filter(MetadataImports, json => {
            return _.get(json, 'type') === 'column'
                && _.get(json, 'data.name', '').startsWith(object_name + '.');
        }) as RecordJson[];

        let record_json = _.filter(MetadataImports, json => {
            return _.get(json, 'type') === object_name;
        }) as RecordJson[];

        // Sanity
        if (object_json === undefined) {
            console.error(`!! object '${ object_name }' not found in MetadataImports`);
            return;
        }

        // Show columns
        console.warn('- with columns:', column_json.map(c => c.data.name));

        // Insert the object
        await this.kernel.data.createOne(ObjectType.Object, object_json);
        await this.kernel.data.createAll(ObjectType.Column, column_json);

        // Insert the object records
        await this.kernel.data.createAll(object_name, record_json);
    }
    
    async up() {
        try {
            // Current database name
            let dn = this.knex.client.config.connection.database;

            // Start the tx
            await this.knex.raw('BEGIN TRANSACTION;');

            // Reset any existing DB contents
            await this.deleteAll();
        
            // Install the core system data?
            await this.createSystem();

            // Startup the kernel so we have basic data structures
            await this.kernel.startup();

            // Install module: domain & user
            await this.importObject('domain');
            await this.importObject('user');
            await this.importObject('config');

            // Install testing support
            await this.importObject('test');

            // Commit the transaction
            await this.knex.raw('COMMIT;');
        }

        catch (error) {
            // Rollback the transaction
            await this.knex.raw('ROLLBACK;');

            // Trace the error
            console.trace(error.stack || error);

            // Return as an error
            process.exit(1);
        }
    }
}
