import _ from 'lodash';
import knex from 'knex';
import { Knex } from 'knex';

// Create the driver reference
export const KnexConfig = {
    debug: process.env.POSTGRES_DEBUG === 'true',
    client: 'postgresql',
    connection: {
        host:     process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        user:     process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    },
    pool: {
        min: 0,
        max: 10
    }
};

// Test contexts have lower connection pool sizes
export const KnexConfigTest = _.defaults({ 
    pool: {
        min: 0,
        max: 2
    }
}, KnexConfig);

// Create the app-wide connection
export const KnexDriver = knex(KnexConfig);

// Classes
import { System } from '../classes/system';
import { SystemService } from '../classes/system';

// Errors
export class KnexError extends Error {};
export class KnexTransactionMissingError extends KnexError {};
export class KnexTransactionAlreadyStartedError extends KnexError {};
export class KnexDriverMissingError extends KnexError {};

// Implementation
export class SystemKnex implements SystemService {
    public readonly db: Knex;
    public tx: Knex.Transaction | undefined;

    constructor(private readonly system: System) {
        if (this.system.isTest()) {
            this.db = knex(KnexConfigTest);
        }

        else {
            this.db = KnexDriver; // shared pool
        }
    }

    get schema(): Knex.SchemaBuilder {
        if (this.tx === undefined) {
            throw new KnexTransactionMissingError();
        }

        return this.tx.schema;
    }

    get driver(): Knex {
        if (this.tx === undefined) {
            throw new KnexTransactionMissingError();
        }

        return this.tx;
    }

    get fn() {
        return this.db.fn;
    }

    async startup(): Promise<void> {
        if (this.tx !== undefined) {
            throw new KnexTransactionAlreadyStartedError();
        }

        // Start the transation
        this.tx = await this.db.transaction();

        // Send config commands
        await this.tx.raw('SET search_path TO system,test;');
    }

    async cleanup(): Promise<void> {
        if (this.tx === undefined) {
            throw new KnexTransactionMissingError();
        }

        if (this.system.isTest()) {
            await this.tx.rollback();
            await this.db.destroy();
        }

        else {
            await this.tx.commit();
        }

        // Unset the transaction
        this.tx = undefined;
    }
}