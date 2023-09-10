// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            host:     Bun.env.POSTGRES_HOST,
            database: Bun.env.POSTGRES_DB,
            user:     Bun.env.POSTGRES_USER,
            password: Bun.env.POSTGRES_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './dst/automigrate'
        }
    }
};
