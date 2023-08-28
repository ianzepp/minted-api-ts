// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'mgc-minted-api-dev',
      user:     null,
      password: null
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './dst/migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'mgc-staging',
      user:     null,
      password: null
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './dst/migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'mgc-prod',
      user:     null,
      password: null
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './dst/migrations'
    }
  }

};
