import _ from 'lodash';

// For importing packages
import fs from 'fs-extra';
import path from 'path';
import klaw from 'klaw-sync';
import { sync as globSync } from 'glob';

// Local imports
import { Kernel } from '@kernel/classes/kernel';
import { Object } from '@kernel/classes/object';
import { RecordFlat, RecordJson } from '@kernel/classes/record';

// Implementation
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

            // Core kernel
            await this.import('kernel');

            // Install packages
            await this.import('system');
            await this.import('system.auth');
            await this.import('system.bulk');
            await this.import('system.mail');
            await this.import('system.test');

            // Package: Open AI
            await this.import('openai');

            // Packagge Open API
            await this.import('openapi');

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
            await this.kernel.knex.deleteTable(table.tablename);
        }
    }

    async createSystem() {
        // Create table `object`
        await this.kernel.knex.createTable('system::object', (table) => {
            table.string('description');
            table.boolean('external').defaultTo(false);
            table.boolean('metadata').defaultTo(false);

            // Compound index
            table.unique(['ns', 'rn']);
        });

        // Create table `column`
        await this.kernel.knex.createTable('system::column', table => {
            table.string('object').notNullable();
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

            // Compound index
            table.unique(['object', 'ns', 'rn']);
        });

        // Add system data for `object`
        await this.insertAll('system::object', 'system', [
            { rn: 'object', metadata: true },
            { rn: 'column', metadata: true },
        ]);    

        await this.insertAll('system::column', 'system', [
           // Columns for 'object'
           { rn: 'description', object: 'system::object',  },
           { rn: 'external', object: 'system::object', type: 'boolean' },
           { rn: 'metadata', object: 'system::object', type: 'boolean' },

           // Columns for 'column'
           { rn: 'object', object: 'system::column', required: true, immutable: true, indexed: true },
           { rn: 'type', object: 'system::column', required: true },
           { rn: 'description', object: 'system::column' },
           { rn: 'audited', object: 'system::column', type: 'boolean' },
           { rn: 'immutable', object: 'system::column', type: 'boolean' },
           { rn: 'indexed', object: 'system::column', type: 'boolean' },
           { rn: 'internal', object: 'system::column', type: 'boolean' },
           { rn: 'required', object: 'system::column', type: 'boolean' },
           { rn: 'unique', object: 'system::column', type: 'boolean' },
           { rn: 'minimum', object: 'system::column', type: 'integer' },
           { rn: 'maximum', object: 'system::column', type: 'integer' },
           { rn: 'precision', object: 'system::column', type: 'integer' },
       ]);
    }

    async insertAll(object_name: string, ns: string, record_rows: RecordFlat[]) {
        let created_at = this.kernel.time;
        let created_by = Kernel.ID;

        for(let record_data of record_rows) {
            console.warn('+', JSON.stringify(record_data));
    
            // Assign UUID
            record_data.id = this.kernel.uuid();
            record_data.ns = ns;
            record_data.rn = record_data.rn || record_data.id;
    
            // Insert record
            await this.kernel.knex.driver(object_name).insert(record_data);
    
            // Insert record::meta
            await this.kernel.knex.driver(object_name + '::meta').insert({
                id: record_data.id,
                ns: record_data.ns,
                created_at: created_at,
                created_by: created_by,
            });
        }    
    }

    async import(import_name: string) {
        console.info('import():', import_name);

        // Use glob to get all directories that match the wildcard
        const directories = globSync(path.join('./src', import_name, 'imports'));

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
            return _.get(json, 'type') === 'system::object'
        }) as RecordJson[];

        for(let object_json of object_list) {
            await this.importObject(imports, object_json);
        }
    }

    async importObject(imports: any[], object_json: RecordJson) {
        let object = new Object(object_json.data);

        console.info(`+ processing "${ object.system_name }" import..`);

        let column_json = _.filter(imports, json => {
            return _.get(json, 'type') === 'system::column'
                && _.get(json, 'data.object', '') === object.system_name;
        }) as RecordJson[];

        let record_json = _.filter(imports, json => {
            return _.get(json, 'type') === object.system_name
        }) as RecordJson[];

        if (object_json === undefined) {
            console.error(`!! object '${ object.system_name }' not found in imports`);
            return;
        }

        // Insert the object
        if (object_json) {
            console.warn('  + object as type', [object_json.type]);
            await this.kernel.data.createOne('system::object', object_json);
        }

        if (column_json.length) {
            console.warn('  + columns:', column_json.map(c => c.data.rn));
            await this.kernel.data.createAll('system::column', column_json);
        }

        // Insert the object records
        if (record_json.length) {
            console.warn('  + records:', record_json.map(c => c.data.rn));
            await this.kernel.data.createAll(object.system_name, record_json);
        }
    }
    
}
