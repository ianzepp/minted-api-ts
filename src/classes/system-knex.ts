import _ from 'lodash';
import chai from 'chai';
import knex from 'knex';
import dotenv from 'dotenv';

// Needed for types
import { Knex } from 'knex';

// API
import { System } from '../classes/system';

// Shared DB connection
dotenv.config();

chai.expect(process.env).property('PGHOST').string;
chai.expect(process.env).property('PGPORT').string;
chai.expect(process.env).property('PGDATABASE').string;

export const KnexDriverOptions = {
    client: 'pg',
    connection: {
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT, 10),
        database: process.env.PGDATABASE
    }
}

export const KnexDriver = knex(KnexDriverOptions);

export class SystemKnex {
    private _transaction: Knex.Transaction | undefined;

    constructor(private readonly system: System) {}

    async startup() {
        
    }

    async transaction(runFn: () => Promise<any>) {
        return KnexDriver.transaction(tx => {
            this._transaction = tx;
            return runFn();
        }).finally(() => {
            this._transaction = undefined;
        });
    }

    tx(using: string) {
        if (this._transaction) {
            return KnexDriver(using).transacting(this._transaction);
        }
        else {
            return KnexDriver(using);
        }
    }
}