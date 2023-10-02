import _ from 'lodash';
import knex from 'knex';

// Default config
export const KnexConfig = {
    client: Bun.env.KNEX_CLIENT || undefined,
    connection: {
        host:     Bun.env.KNEX_HOST || undefined,
        port:     _.toInteger(Bun.env.KNEX_PORT || undefined),
        user:     Bun.env.KNEX_USER || undefined,
        password: Bun.env.KNEX_PASSWORD || undefined,
        database: Bun.env.KNEX_DATABASE || undefined,
        filename: Bun.env.KNEX_FILENAME || undefined,
        acquireConnectionTimeout:  _.toInteger(Bun.env.KNEX_TIMEOUT || undefined),
    },
    pool: {
        min: _.toInteger(Bun.env.KNEX_POOL_MIN || undefined),
        max: _.toInteger(Bun.env.KNEX_POOL_MAX || undefined)
    }
};

// Create a new driver
export function KnexDriverFn() {
    return knex(KnexConfig);
}

// App-wide default driver
export const KnexDriver = KnexDriverFn();