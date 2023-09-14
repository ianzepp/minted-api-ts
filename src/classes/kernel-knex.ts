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
import { Kernel } from '@classes/kernel';
import { KernelService } from '@classes/kernel';

// Errors
export class KnexError extends Error {};
export class KnexTransactionMissingError extends KnexError {};
export class KnexTransactionAlreadyStartedError extends KnexError {};
export class KnexDriverMissingError extends KnexError {};

// Implementation
export interface KernelKnexConfig {
    isolate: boolean;
}

export class KernelKnex implements KernelService {
    public db: Knex = KnexDriver;
    public tx: Knex.Transaction | undefined;

    constructor(private readonly kernel: Kernel) {}

    async startup(): Promise<void> {
        // Isolated driver for test suites
        if (this.kernel.isTest()) {
            this.db = knex(KnexConfig);
        }
    }

    async cleanup(): Promise<void> {
        // Unset the userinfo
        await this.db.raw(`
            RESET minted.userinfo_id;
            RESET minted.userinfo_ns;
            RESET minted.userinfo_ts;
        `);

        // Isolated driver. Kill the connection so tests don't hang
        if (this.kernel.isTest()) {
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

        // Set the current user ID for the transaction
        await this.tx.raw(`
            SET LOCAL minted.userinfo_id = '${ this.kernel.user_id }';
            SET LOCAL minted.userinfo_ns = '${ this.kernel.user_ns }';
            SET LOCAL minted.userinfo_ts = '${ this.kernel.time_iso }';
        `);
    }

    async commit() {
        // Commit the transaction
        if (this.tx.isCompleted() === false) {
            await this.tx.commit();
        }

        // Done
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

        // For example, using a `schema_path` of `system.user`, then:
        //
        // 1. split the path into ns=kernel and sn=client
        // 2. start from a top-level table of `system.user`
        // 3. pull in timestamps from `system__meta.client`
        // 4. restrict to only the running user's visible namespaces
        
        let knex = this
            .driver<T>({ data: `${ ns }__data.${ sn }` })
            .join({ meta: `${ ns }__meta.${ sn }` }, 'meta.id', 'data.id');

        // Root ignores namespace visiblity by default. This may change with RLS.
        if (this.kernel.isRoot() === false) {
            knex = knex.whereIn('data.ns', this.kernel.auth.namespaces);
        }

        return knex;
    }

    driverTo<T = _.Dictionary<any>>(schema_path: string, alias: 'data' | 'meta' = 'data') {
        let [ns, sn] = schema_path.split('.');

        let knex = this.driver<T>(`${ ns }__${ alias }.${ sn } as ${ alias }`);

        // Root ignores namespace visiblity by default. This may change with RLS.
        if (this.kernel.isRoot() === false) {
            knex = knex.whereIn(`${ alias }.ns`, this.kernel.auth.namespaces);
        }

        return knex;
    }
}