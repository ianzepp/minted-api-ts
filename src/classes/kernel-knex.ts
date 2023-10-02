import _ from 'lodash';
import { Knex } from 'knex';

// Knex imports 
import { KnexDriver } from '../knex';
import { KnexDriverFn } from '../knex';

// Imports
import { Kernel } from '@classes/kernel';
import { RecordFlat } from '@typedefs/record';
import { Service } from '@typedefs/kernel';

// Errors
export class KnexError extends Error {};
export class KnexTransactionMissingError extends KnexError {};
export class KnexTransactionAlreadyStartedError extends KnexError {};
export class KnexDriverMissingError extends KnexError {};

// Implementation
export interface KernelKnexConfig {
    isolate: boolean;
}

export class KernelKnex implements Service {
    public db: Knex = KnexDriver;
    public tx: Knex.Transaction | undefined;

    constructor(private readonly kernel: Kernel) {}

    async startup(): Promise<void> {
        // Isolated driver for test suites
        if (this.kernel.isTest()) {
            this.db = KnexDriverFn();
        }
    }

    async cleanup(): Promise<void> {
        // // Unset the userinfo
        // await this.db.raw(`
        //     RESET minted.userinfo_id;
        //     RESET minted.userinfo_ns;
        //     RESET minted.userinfo_ts;
        // `);

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

        // // Set the current user ID for the transaction
        // await this.tx.raw(`
        //     SET LOCAL minted.userinfo_id = '${ this.kernel.user_id }';
        //     SET LOCAL minted.userinfo_ns = '${ this.kernel.user_ns }';
        //     SET LOCAL minted.userinfo_ts = '${ this.kernel.timeISO() }';
        // `);
    }

    async commit() {
        // Commit the transaction
        if (this.tx && this.tx.isCompleted() === false) {
            await this.tx.commit();
        }

        // Done
        this.tx = undefined;
    }

    async rollback() {
        if (this.tx && this.tx.isCompleted() === false) {
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

    selectTo<T = RecordFlat>(object_path: string) {
        // For example, using a `object_path` of `system.user`, then:
        //
        // 1. split the path into ns=kernel and sn=client
        // 2. start from a top-level table of `system.user`
        // 3. pull in timestamps from `system__meta.client`
        // 4. restrict to only the running user's visible namespaces
        
        let knex = this
            .driver<T>({ data: `${ object_path }/data` })
            .join({ meta: `${ object_path }/meta` }, 'meta.id', 'data.id');

        // Root ignores namespace visiblity by default. This may change with RLS.
        if (this.kernel.isRoot() === false) {
            knex = knex.whereIn('data.ns', this.kernel.auth.namespaces);
        }

        return knex;
    }

    driverTo<T = _.Dictionary<any>>(object_path: string, alias: 'data' | 'meta' = 'data') {
        let knex = this.driver<T>(`${ object_path }/${ alias } as ${ alias }`);

        // Root ignores namespace visiblity by default. This may change with RLS.
        if (this.kernel.isRoot() === false) {
            knex = knex.whereIn(`${ alias }.ns`, this.kernel.auth.namespaces);
        }

        return knex;
    }
}