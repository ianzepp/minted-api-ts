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
export interface SystemKnexConfig {
    isolate: boolean;
}

export class SystemKnex implements SystemService {
    public db: Knex = KnexDriver;
    public tx: Knex.Transaction | undefined;

    constructor(private readonly system: System) {}

    async startup(): Promise<void> {
        // Isolated driver for test suites
        if (this.system.isTest()) {
            this.db = knex(KnexConfig);
        }
    }

    async cleanup(): Promise<void> {
        // Isolated driver. Kill the connection so tests don't hang
        if (this.system.isTest()) {
            await this.db.destroy();
        }
    }

    //
    // Transaction methods
    //

    async transactionFn(runFn: () => Promise<any>, config?: Knex.TransactionConfig): Promise<void> {
        return this.db.transaction(tx => {
            this.tx = tx;
            return runFn();
        }, config).finally(() => this.tx = undefined);
    }

    async transaction() {
        // Initiate a transaction
        this.tx = await this.db.transaction();

        // Save the session inside the transaction context
        await this.tx.raw(`
            CREATE TEMPORARY TABLE tx_session_data (
                user_id UUID, 
                user_ns TEXT,
                user_ts TIMESTAMP
            );

            INSERT INTO tx_session_data (user_id, user_ns, user_ts) 
            VALUES ('${ this.system.user_id }', '${ this.system.user_ns }', CURRENT_TIMESTAMP);
        `);
    }

    async commit() {
        return this.tx.commit().finally(() => this.tx = undefined);
    }

    async rollback() {
        return this.tx.rollback().finally(() => this.tx = undefined);
    }

    //
    // Driver methods
    //

    get fn() {
        return this.driver.fn;
    }

    get schema(): Knex.SchemaBuilder {
        return this.driver.schema;
    }

    get driver(): Knex {
        return this.tx ?? this.db;
    }

    selectTo(schema_path: string): Knex.QueryBuilder {
        let [ns, sn] = schema_path.split('.');

        // For example, using a `schema_path` of `system.client_user`, then:
        //
        // 1. split the path into ns=system and sn=client_user
        // 2. start from a top-level table of `system.client_user`
        // 3. pull in timestamps from `system__meta.client_user`
        // 4. restrict to only the running user's visible namespaces
        
        return this
            .driver({ data: `${ ns }.${ sn }` })
            .join({ meta: `${ ns }__meta.${ sn }` }, 'meta.id', 'data.id')
            .whereIn('data.ns', this.system.auth.namespaces);
    }

    driverTo(schema_path: string, suffix?: string): Knex.QueryBuilder {
        let [ns, sn] = schema_path.split('.');

        // For example, converts `system` to `system__meta`
        if (typeof suffix === 'string') {
            ns = ns + '__' + suffix;
        }

        return this
            .driver(`${ ns }.${ sn }`)
            .whereIn('ns', this.system.auth.namespaces);
    }

}