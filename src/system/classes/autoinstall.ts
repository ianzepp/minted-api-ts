import _ from 'lodash';
import { Knex } from 'knex';

// For importing packages
import fs from 'fs-extra';
import path from 'path';
import klaw from 'klaw-sync';
import { sync as globSync } from 'glob';

// Local imports
import { Kernel } from '@system/kernels/kernel';
import { Object } from '@system/classes/object';
import { Column } from '@system/classes/column';

// Import table functions
import { createTable, deleteTable, insertAll } from './knex';

// Import preloads
import { RecordJson } from '../typedefs/record';

export class AutoInstall {
    constructor(public readonly kernel: Kernel = new Kernel()) {}

    get knex() {
        return this.kernel.knex.driver;
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

            // Package: Open AI
            await this.import('openai');
            await this.import('openai.*');

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
        console.info('import(): src/ packages/', import_name);

        // Use glob to get all directories that match the wildcard
        const directories = globSync(path.join(__dirname, '../packages', import_name));

        // Use klaw to get all files in each directory
        const import_list = directories.flatMap(directory => klaw(directory, {
            nodir: true,
            traverseAll: true
        }));

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
        let object = Object.from(object_json.data);
        let object_name = object_json.data.name;

        console.info(`- object "${ object.system_name }"`);

        let column_json = _.filter(imports, json => {
            return _.get(json, 'type') === 'column'
                && _.get(json, 'data.name', '').startsWith(object.object_name + '.');
        }) as RecordJson[];

        let record_json = _.filter(imports, json => {
            return _.get(json, 'type') === object.system_name
                || _.get(json, 'type') === object.object_name
        }) as RecordJson[];

        if (object_json === undefined) {
            console.error(`!! object '${ object.system_name }' not found in imports`);
            return;
        }

        // Insert the object
        if (object_json) {
            await this.kernel.data.createOne('object', object_json);
        }

        if (column_json.length) {
            console.warn('  - with columns:', column_json.map(c => c.data.name));
            await this.kernel.data.createAll('column', column_json);
        }

        // Insert the object records
        if (record_json.length) {
            console.warn('  - with records:', record_json.map(c => c.data.name));
            await this.kernel.data.createAll(object.system_name, record_json);
        }
    }
    
}
