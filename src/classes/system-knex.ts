import _ from 'lodash';
import { Knex } from 'knex';

// Classes
import { KnexDriver } from './knex';
import { Filter } from '../classes/filter';
import { System } from '../classes/system';
import { SystemService } from '../classes/system';

// Layouts
import { RecordData } from '../layouts/record';

export class SystemKnex implements SystemService {
    private tx: Knex.Transaction | undefined;

    constructor(private readonly system: System) {}

    get schema(): Knex.SchemaBuilder {
        if (this.tx === undefined) {
            throw new Error('Not allowed to operate outside of a transaction context');
        }

        return this.tx.schema;
    }

    get driver(): Knex {
        if (this.tx === undefined) {
            throw new Error('Not allowed to operate outside of a transaction context');
        }

        return this.tx;
    }

    async startup(): Promise<void> {
        console.debug('SystemKnex.startup()');

        if (this.tx !== undefined) {
            throw new Error('Transaction context is already created?!?');
        }

        this.tx = await KnexDriver.transaction();
    }

    async cleanup(): Promise<void> {
        console.debug('SystemKnex.cleanup()');

        if (this.tx === undefined) {
            throw new Error('Transaction context was lost?!?');
        }

        if (this.system.isTest()) {
            console.debug('SystemKnex.cleanup() is rolling back');
            await this.tx.rollback();
        }

        else {
            console.debug('SystemKnex.cleanup() is committing');
            await this.tx.commit();
        }

        // Unset the transaction
        this.tx = undefined;
    }
}