import _ from 'lodash';
import { Knex } from 'knex';

// Classes
import { KnexDriver } from './knex';
import { Filter } from '../classes/filter';
import { System } from '../classes/system';
import { SystemRoot } from '../classes/system-root';

// Layouts
import { RecordData } from '../layouts/record';

export class SystemKnex {
    private __transaction: Knex.Transaction | undefined;

    constructor() {}

    async startup(): Promise<void> {
        await KnexDriver.raw('SELECT 1'); // test connection at startup
    }

    async destroy(): Promise<void> {
        await KnexDriver.destroy();
    }

    async transaction(runFn: () => Promise<any>): Promise<any> {
        return KnexDriver.transaction(async tx => {
            this.__transaction = tx;
            return runFn();
        }).finally(() => {
            this.__transaction = undefined;
        });
    }


    // 
    // Build requests
    //

    toTx(schema_name: string, alias?: string) {
        let knex;
        
        if (typeof alias === 'string') {
            knex = KnexDriver(schema_name + ' as ' + alias);
        }

        else {
            knex = KnexDriver(schema_name);
        }
        
        if (this.__transaction) {
            knex = knex.transacting(this.__transaction);
        }

        return knex;
    }
}