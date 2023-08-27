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

// Initialize the database by first entering a promise context
KnexDriver.raw('SELECT 1').then(async () => {
    try {
        // Enable UUID generation
        await KnexDriver.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Run the table creation
        await createSchemaTable(KnexDriver);
        await createColumnTable(KnexDriver);
        await createMetaInfoTable(KnexDriver);

        console.warn('AutoInstall: Finished database installation process.');

        // Insert the default metadata

        // Loop over the imported schema json from metadata.ts, and insert into knex into the schema table.
        let insert_schemas = _.map(_.values(MetadataSchemas), schema => {
            return KnexDriver('schema').insert({
                id: uuid(),
                ns: null,
                sc: null,
                name: schema.name,
                description: schema.description
            });
        });

        await Promise.all(insert_schemas);


    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        await KnexDriver.destroy();
        process.exit();
    }
});