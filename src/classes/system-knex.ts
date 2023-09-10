import _ from 'lodash';
import knex from 'knex';
import { Knex } from 'knex';

// Create the driver reference
export const KnexConfig = {
    debug: process.env.POSTGRES_DEBUG === 'true',
    client: 'postgresql',
    connection: {
        host:     process.env.POSTGRES_HOST,
        port:     process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user:     process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        acquireConnectionTimeout: 10000,
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
    public db: Knex | undefined;

    constructor(private readonly system: System) {

    }

    get schema(): Knex.SchemaBuilder {
        return this.db.schema;
    }

    get driver(): Knex {
        return this.db;
    }

    get fn() {
        return this.db.fn;
    }

    async startup(): Promise<void> {
        this.db = knex(KnexConfig);
    }

    async cleanup(): Promise<void> {
        this.db.destroy();
        this.db = undefined;
    }
}