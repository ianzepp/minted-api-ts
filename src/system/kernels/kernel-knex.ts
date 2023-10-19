import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import Debug from 'debug';

// Knex stuff
import { KnexDriver, KnexDriverFn } from '@system/classes/knex';
import { Knex } from 'knex';

// Classes
import { Kernel } from '@system/kernels/kernel';

// Debug messages
const debug = Debug('minted:system:kernel-knex');

// Implementation
export class KernelKnex {
    public db: Knex = KnexDriver;
    public tx: Knex.Transaction | undefined;
    public readonly uuid = uuid;

    constructor(private readonly kernel: Kernel) {}

    async startup(): Promise<void> {
        debug('startup() starting');

        // Running in a test environment?
        if (this.kernel.isNodeTest()) {
            await this.isolate();
            await this.transaction();
        }

        debug('startup() ok');
    }

    async cleanup(): Promise<void> {
        debug('cleanup() starting');

        // Running in a test environment?
        if (this.kernel.isNodeTest()) {
            await this.rollback();
            await this.destroy();
        }

        debug('cleanup() ok');
    }

    //
    // Transactions
    //

    async transaction() {
        if (this.tx === undefined || this.tx.isCompleted()) {
            this.tx = await this.db.transaction();
        }

        return this.tx;
    }

    async commit() {
        if (this.tx && this.tx.isCompleted() === false) {
            await this.tx.commit();
        }

        this.tx = undefined;
    }

    async rollback() {
        if (this.tx && this.tx.isCompleted() === false) {
            await this.tx.rollback();
        }

        this.tx = undefined;
    }

    async isolate() {
        return this.db = KnexDriverFn();
    }

    async destroy() {
        await this.db.destroy();
    }

    //
    // Direct access
    //
    
    get driver(): Knex {
        return this.tx || this.db || KnexDriver;
    }

    get schema(): Knex.SchemaBuilder {
        return this.driver.schema;
    }

    get fn() {
        return this.driver.fn;
    }

    //
    // Direct DB/TX methods
    //

    driverTo(object_name: string, type: 'data' | 'meta' | 'acls '= 'data', record_ids?: string[]) {
        let knex: Knex.QueryBuilder;

        if (type === 'data') {
            knex = this.driver(`${ object_name } as ${ type }`);
        }

        else {
            knex = this.driver(`${ object_name }::${ type } as ${ type }`);
        }

        // Apply namespace visibility
        if (this.kernel.isRoot() === false) {
            knex = knex.whereIn(`${ type }.ns`, this.kernel.namespaces);
        }

        // Apply specific record IDs?
        if (record_ids && record_ids.length) {
            knex = knex.whereIn('id', record_ids);
        }

        // Done
        return knex;
    }
    
    selectTo(object_name: string) {
        let knex = this
            .driver({ data: `${ object_name }` })
            .leftJoin({ meta: `${ object_name }::meta` }, 'meta.id', 'data.id')
            .leftJoin({ acls: `${ object_name }::acls` }, 'acls.id', 'data.id');

        // Apply namespace visibility
        if (this.kernel.isRoot() === false) {
            knex = knex.whereIn(`data.ns`, this.kernel.namespaces);
        }

        // Done
        return knex;
    }

    //
    // DB schema modifications
    //

    async createTable(object_name: string, createFn: (table: Knex.CreateTableBuilder) => void): Promise<void> {
        debug('createTable():', object_name);

        // Data table
        await this.schema.createTable(object_name, (table) => {
            table.string('id').notNullable().primary();
            table.string('ns').notNullable();
    
            // Apply extra columns
            createFn(table);
        });
    
        await this.schema.createTable(object_name + '::meta', (table) => {
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
    
        await this.schema.createTable(object_name + '::acls', (table) => {
            table.string('id').notNullable().primary();
            table.string('ns').notNullable();
    
            table.specificType('access_full', 'text ARRAY');
            table.specificType('access_edit', 'text ARRAY');
            table.specificType('access_read', 'text ARRAY');
            table.specificType('access_deny', 'text ARRAY');
        });
    }
    
    async updateTable(object_name: string, updateFn: (table: Knex.AlterTableBuilder) => void): Promise<void> {
        debug('updateTable():', object_name);

        await this.schema.alterTable(object_name, (table) => {
            updateFn(table);
        });
    }
    
    async deleteTable(object_name: string): Promise<void> {
        debug('deleteTable():', object_name);

        await this.schema.dropTableIfExists(object_name + '::acls');
        await this.schema.dropTableIfExists(object_name + '::meta');
        await this.schema.dropTableIfExists(object_name);
    }
}