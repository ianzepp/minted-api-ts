import _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { Knex } from "knex";
import { KnexDriver } from './classes/database';

// Preloaded local metadata files
import { MetadataSchemas } from './classes/metadata';
import { MetadataColumns } from './classes/metadata';

// Function to create the 'schema' table
const createSchemaTable = async (knex: Knex) => {
    await knex.schema.createTable("schema", (table) => {
        table.uuid("id").primary();
        table.string("ns");
        table.string("sc");
        table.string("name").notNullable();
        table.text("description");

        // Schema names are unique per namespace
        table.unique(["ns", "name"]);
    });
};

// Function to create the 'column' table
const createColumnTable = async (knex: Knex) => {
    await knex.schema.createTable("column", (table) => {
        table.uuid("id").primary();
        table.string("ns");
        table.string("sc");
        table.uuid("schema_id").references("id").inTable("schema").onDelete("CASCADE");
        table.string("name").notNullable();
        table.string("type").notNullable();
        table.text("description");

        // Columns names are unique per namespace and parent schema
        table.unique(["ns", "name", "schema_id"]);
    });
};

// Function to create the 'info' table
const createMetaInfoTable = async (knex: Knex) => {
    await knex.schema.createTable("metainfo", (table) => {
        table.uuid("id").primary().notNullable();
        table.string("id_table").notNullable();
        table.timestamp("created_at").notNullable();
        table.timestamp("updated_at");
        table.timestamp("expired_at");
        table.timestamp("deleted_at");
        table.uuid("created_by");
        table.uuid("updated_by");
        table.uuid("expired_by");
        table.uuid("deleted_by");
        table.specificType("acls_full", "uuid ARRAY");
        table.specificType("acls_edit", "uuid ARRAY");
        table.specificType("acls_read", "uuid ARRAY");
        table.specificType("acls_deny", "uuid ARRAY");
    });
};

const insertSchemas = async (knex: Knex) => {
    let created_at = new Date().toISOString();
    let created_by = '00000000-0000-0000-0000-000000000000';

    for(let schema_data of _.values(MetadataSchemas)) {
        let schema = _.merge({ id: uuid() }, schema_data);

        let insert_data = await knex('schema').insert(schema);
        let insert_info = await knex('metainfo').insert({ 
            id: schema.id, 
            id_table: 'schema',
            created_at: created_at,
            created_by: created_by
        });

        console.warn('schema_data', schema.id, schema.name);
    }
}

// Initialize the database by first entering a promise context
KnexDriver.raw('SELECT 1').then(async () => {
    try {
        // Enable UUID generation
        await KnexDriver.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Run the table creation
        await createSchemaTable(KnexDriver);
        await createColumnTable(KnexDriver);
        await createMetaInfoTable(KnexDriver);

        console.warn('AutoInstall: Finished core installation...');

        // Insert builtins
        await insertSchemas(KnexDriver);

    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        await KnexDriver.destroy();
        process.exit();
    }
});