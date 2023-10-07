import { v4 as uuid } from 'uuid';
import knex, { Knex } from 'knex';
import KnexConfig from '@root/knexconfig';
import { Kernel } from './kernel';

export const KnexDriverFn = () => knex(KnexConfig);
export const KnexDriver = KnexDriverFn();

export async function createTable(driver: Knex, object_name: string, createFn: (table: Knex.CreateTableBuilder) => void): Promise<void> {
    // Data table
    await driver.schema.createTable(object_name, (table) => {
        table.string('id').notNullable().primary();
        table.string('ns').notNullable();

        // Every table always gets a default name column. Can be null.
        table.string('name');

        // Apply extra columns
        createFn(table);
    });

    await driver.schema.createTable(object_name + '::meta', (table) => {
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

    await driver.schema.createTable(object_name + '::acls', (table) => {
        table.string('id').notNullable().primary();
        table.string('ns').notNullable();

        table.specificType('access_full', 'text ARRAY');
        table.specificType('access_edit', 'text ARRAY');
        table.specificType('access_read', 'text ARRAY');
        table.specificType('access_deny', 'text ARRAY');
    });
}

export async function updateTable(driver: Knex, object_name: string, updateFn: (table: Knex.AlterTableBuilder) => void): Promise<void> {
    await driver.schema.alterTable(object_name, (table) => {
        updateFn(table);
    });
}

export async function deleteTable(driver: Knex, object_name: string): Promise<void> {
    await driver.schema.dropTableIfExists(object_name + '::acls');
    await driver.schema.dropTableIfExists(object_name + '::meta');
    await driver.schema.dropTableIfExists(object_name);
}

export async function insertAll(driver: Knex, object_name: string, record_rows: _.Dictionary<any>[]) {
    // Process
    for(let record_data of record_rows) {
        console.warn('+', JSON.stringify(record_data));

        // Assign UUID
        record_data.id = uuid();

        // Insert record
        await driver(object_name).insert(record_data);

        // Insert record::meta
        await driver(object_name + '::meta').insert({
            id: record_data.id,
            ns: record_data.ns,
            created_at: new Date().toISOString(),
            created_by: Kernel.ID,
        });
    }
}