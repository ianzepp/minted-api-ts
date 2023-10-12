import _ from 'lodash';
import { Knex } from 'knex';

// For importing packages
import fs from 'fs-extra';
import path from 'path';
import klaw from 'klaw-sync';

// Local imports
import { Kernel } from '@kernels/kernel';
import { ObjectType } from '@typedefs/object';

// Import table functions
import { createTable, deleteTable, insertAll } from './knex';

// Import preloads
import MetadataImports from '@loaders/imports';
import { RecordJson } from '../typedefs/record';

export class AutoInstall {
    constructor(public readonly kernel: Kernel = new Kernel()) {}

    get knex() {
        return this.kernel.knex.driver;
    }

    async deleteAll() {
        const tables = await this.knex.raw("SELECT tablename FROM pg_tables WHERE schemaname='public';");

        for (let table of tables.rows) {
            await deleteTable(this.knex, table.tablename);
        }
    }

    async createSystem() {
        // Create table `object`
        await createTable(this.knex, 'system::object', (table) => {
            table.string('type').notNullable().defaultTo('database');
            table.string('description');

            table.boolean('external').defaultTo(false);
            table.boolean('metadata').defaultTo(false);

            // Compound index on (ns, name)
            table.unique(['ns', 'name']);
        });

        // Create table `column`
        await createTable(this.knex, 'system::column', table => {
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
        await insertAll(this.knex, 'system::object', [
            { ns: 'system', name: 'object', metadata: true },
            { ns: 'system', name: 'column', metadata: true },
        ]);    

        await insertAll(this.knex, 'system::column', [
           // Columns for 'object'
           { ns: 'system', name: 'object.name', required: true, immutable: true, indexed: true  },
           { ns: 'system', name: 'object.description' },
           { ns: 'system', name: 'object.external', type: 'boolean' },
           { ns: 'system', name: 'object.metadata', type: 'boolean' },

           // Columns for 'column'
           { ns: 'system', name: 'column.name', required: true, immutable: true, indexed: true },
           { ns: 'system', name: 'column.type', required: true },
           { ns: 'system', name: 'column.description' },

           { ns: 'system', name: 'column.audited', type: 'boolean' },
           { ns: 'system', name: 'column.immutable', type: 'boolean' },
           { ns: 'system', name: 'column.indexed', type: 'boolean' },
           { ns: 'system', name: 'column.internal', type: 'boolean' },
           { ns: 'system', name: 'column.required', type: 'boolean' },
           { ns: 'system', name: 'column.unique', type: 'boolean' },

           { ns: 'system', name: 'column.minimum', type: 'integer' },
           { ns: 'system', name: 'column.maximum', type: 'integer' },
           { ns: 'system', name: 'column.precision', type: 'integer' },
       ]);
    }

    async import(import_name: string) {
        console.info('import():', import_name);

        const import_list = klaw(path.join(__dirname, '../packages', import_name), {
            nodir: true,
            traverseAll: true
        });

        // Build the list of imports
        let imports = _.chain(import_list)
            // Convert the klaw format into a simple path
            .map(preload_info => preload_info.path)

            // Only include JSON files
            .filter(preload_path => preload_path.endsWith('.json'))

            // Read the JSON
            .map(preload_path => fs.readJsonSync(preload_path))

            // Done
            .value();

        // For each object in the package, import it individually
        let object_list = _.filter(imports, json => {
            return _.get(json, 'type') === 'object'
        }) as RecordJson[];

        for(let object_json of object_list) {
            await this.importObject(imports, object_json);
        }
    }

    async importObject(imports: any[], object_json: RecordJson) {
        console.info(`- object "${ object_json.data.name }"`);

        let object_name = object_json.data.name;

        let column_json = _.filter(imports, json => {
            return _.get(json, 'type') === 'column'
                && _.get(json, 'data.name', '').startsWith(object_name + '.');
        }) as RecordJson[];

        let record_json = _.filter(imports, json => {
            return _.get(json, 'type') === object_name;
        }) as RecordJson[];

        if (object_json === undefined) {
            console.error(`!! object '${ object_name }' not found in imports`);
            return;
        }

        // Show columns
        console.warn('  - with columns:', column_json.map(c => c.data.name));
        console.warn('  - with records:', record_json.map(c => c.data.name));

        // Insert the object
        if (object_json) {
            await this.kernel.data.createOne('object', object_json);
        }

        if (column_json.length) {
            await this.kernel.data.createAll('column', column_json);
        }

        // Insert the object records
        if (record_json.length) {
            await this.kernel.data.createAll(object_name, record_json);
        }
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

            // Install packages
            await this.import('system');

            // Install authentication
            await this.import('system.auth');

            // Install IMAP/SMTP and generic mail support
            await this.import('system.mail');

            // Install testing support
            await this.import('system.test');

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
