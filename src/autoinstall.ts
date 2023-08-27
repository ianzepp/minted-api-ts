import { Knex } from "knex";
import { KnexDriver } from './classes/database';

// Function to create the 'schema' table
const createSchemaTable = async (knex: Knex) => {
    await knex.schema.createTable("schema", (table) => {
        table.uuid("id").primary();
        table.string("ns");
        table.string("sc");
        table.string("name").notNullable();
        table.text("description");
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
        table.timestamp("trashed_at");
        table.timestamp("deleted_at");
        table.uuid("created_by");
        table.uuid("updated_by");
        table.uuid("expired_by");
        table.uuid("trashed_by");
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
    } catch (error) {
        console.error("Error creating tables:", error);
    } finally {
        await KnexDriver.destroy();
        process.exit();
    }
});