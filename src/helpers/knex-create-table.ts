import { Knex } from 'knex';

export default async function(knex: Knex, table_path: string): Promise<void> {
    console.debug('knex-create-table: %j', table_path);

    let [namespace, table_name] = table_path.split('.');

    // Data table
    await knex.schema.withSchema(namespace).createTable(table_name, (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('ns');
    });

    // Meta table
    await knex.schema.withSchema(namespace).createTable(table_name + '__meta', (table) => {
        table.uuid('id').primary().references('id').inTable(table_path).onDelete('CASCADE');
        table.string('ns');

        table.timestamp('created_at', { useTz: false }).index().notNullable().defaultTo(knex.fn.now());        
        table.uuid('created_by').index().notNullable().defaultTo('00000000-0000-0000-0000-000000000000');

        table.timestamp('updated_at', { useTz: false }).index();
        table.uuid('updated_by').index();

        table.timestamp('expired_at', { useTz: false }).index();
        table.uuid('expired_by').index();

        table.timestamp('deleted_at', { useTz: false }).index();
        table.uuid('deleted_by').index();

        // table.specificType('acls_full', 'uuid ARRAY').defaultTo(knex.raw('ARRAY[]::uuid[]')).index();
        // table.specificType('acls_edit', 'uuid ARRAY').defaultTo(knex.raw('ARRAY[]::uuid[]')).index();
        // table.specificType('acls_read', 'uuid ARRAY').defaultTo(knex.raw('ARRAY[]::uuid[]')).index();
        // table.specificType('acls_deny', 'uuid ARRAY').defaultTo(knex.raw('ARRAY[]::uuid[]')).index();
    });

    // Trigger function for insert
    const insertTriggerFunction = `
        CREATE OR REPLACE FUNCTION ${table_name}_insert_meta() RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO ${namespace}.${table_name}__meta (id, ns)
            VALUES (NEW.id, NEW.ns);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `;

    // Create trigger for insert
    const createInsertTrigger = `
        CREATE TRIGGER ${table_name}_insert_meta_trigger
        AFTER INSERT ON ${namespace}.${table_name}
        FOR EACH ROW
        EXECUTE FUNCTION ${table_name}_insert_meta();
    `;

    // Execute the SQL
    await knex.raw(insertTriggerFunction);
    await knex.raw(createInsertTrigger);
}
