import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import Debug from 'debug';

// Knex stuff
import { KnexDriver, KnexDriverFn } from '@system/classes/knex';
import { Knex } from 'knex';

// Classes
import { Kernel } from '@system/kernels/kernel';

// Debug messages
const debug = Debug('minted:kernel-knex');

// Implementation
export class KernelKnex {
    public db: Knex = KnexDriver;
    public tx: Knex.Transaction | undefined;
    public readonly uuid = uuid;

    constructor(private readonly kernel: Kernel) {}

    async startup(): Promise<void> {
        if (this.kernel.isNodeTest()) {
            this.db = KnexDriverFn();
            await this.transaction();
        }
    }

    async cleanup(): Promise<void> {
        if (this.kernel.isNodeTest()) {
            await this.revert();
            await this.db.destroy();
        }
    }

    //
    // Transaction support
    //

    async transaction() {
        if (this.tx !== undefined) {
            throw new Error('Transaction already started!');
        }

        this.tx = await this.db.transaction();
    }

    async commit() {
        if (this.tx && this.tx.isCompleted() === false) {
            await this.tx.commit();
        }

        this.tx = undefined;
    }

    async revert() {
        if (this.tx && this.tx.isCompleted() === false) {
            await this.tx.rollback();
        }

        this.tx = undefined;
    }

    //
    // Direct access
    //
    
    get driver(): Knex {
        return this.tx ?? this.db;
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

    driverTo(object_name: string, type: 'data' | 'meta' | 'acls '= 'data') {
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