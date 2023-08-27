import _ from 'lodash';
import { Knex } from 'knex';

// API
import { KnexDriver } from '../classes/database';
import { System } from '../classes/system';
import { join } from 'path';

export class SystemKnex {
    private _transaction: Knex.Transaction | undefined;

    constructor(private readonly system: System) {}

    async startup() {
        
    }

    async transaction(runFn: () => Promise<any>) {
        return KnexDriver.transaction(async tx => {
            this._transaction = tx;
            return runFn();
        }).finally(() => {
            this._transaction = undefined;
        });
    }

    using(using: string, metainfo: boolean = false) {
        let knex = KnexDriver(using + ' as data');

        if (this._transaction) {
            knex = knex.transacting(this._transaction);
        }

        if (metainfo) {
            knex = knex.join('metainfo as info', 'info.id', 'data.id');
        }

        return knex;
    }
}