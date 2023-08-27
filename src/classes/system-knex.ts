import _ from 'lodash';
import { Knex } from 'knex';

// API
import { KnexDriver } from '../classes/database';
import { System } from '../classes/system';

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

    using(using: string) {
        if (this._transaction) {
            return KnexDriver(using)
                .transacting(this._transaction)
                .join('metainfo', 'metainfo.id', using + '.id');
        }
        else {
            return KnexDriver(using)
                .join('metainfo', 'metainfo.id', using + '.id');
        }
    }
}