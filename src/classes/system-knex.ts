import _ from 'lodash';
import knex from 'knex';
import { Knex } from 'knex';

import { RecordFlat } from '@layouts/record';

// Create the driver reference
export const KnexConfig = {
    debug: Bun.env.POSTGRES_DEBUG === 'true',
    client: 'postgresql',
    connection: {
        host:     Bun.env.POSTGRES_HOST,
        port:     Bun.env.POSTGRES_PORT,
        database: Bun.env.POSTGRES_DB,
        user:     Bun.env.POSTGRES_USER,
        password: Bun.env.POSTGRES_PASSWORD,
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
import { System } from '@classes/system';
import { SystemService } from '@classes/system';

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
            VALUES ('${ this.system.user_id }', '${ this.system.user_ns }', '${ this.system.time_iso }');
        `);
    }

    async commit() {
        if (this.tx.isCompleted() === false) {
            await this.tx.commit();
        }

        this.tx = undefined;
    }

    async rollback() {
        if (this.tx.isCompleted() === false) {
            await this.tx.rollback();
        }

        return this.tx = undefined;
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

    selectTo<T = RecordFlat>(schema_path: string) {
        let [ns, sn] = schema_path.split('.');

        // For example, using a `schema_path` of `system.client_user`, then:
        //
        // 1. split the path into ns=system and sn=client_user
        // 2. start from a top-level table of `system.client_user`
        // 3. pull in timestamps from `system__meta.client_user`
        // 4. restrict to only the running user's visible namespaces
        
        return this
            .driver<T>({ data: `${ ns }__data.${ sn }` })
            .join({ meta: `${ ns }__meta.${ sn }` }, 'meta.id', 'data.id')
            .whereIn('data.ns', this.system.auth.namespaces);
    }

    driverTo<T = _.Dictionary<any>>(schema_path: string, alias: 'data' | 'meta' = 'data') {
        let [ns, sn] = schema_path.split('.');

        return this
            .driver<T>(`${ ns }__${ alias }.${ sn } as ${ alias }`)
            .whereIn(`${ alias }.ns`, this.system.auth.namespaces);
    }

}