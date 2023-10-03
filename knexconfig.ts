import _ from 'lodash';

const config = {
    useNullAsDefault: true,
    client: process.env.KNEX_CLIENT,
    connection: {
        host:     process.env.KNEX_HOST,
        port:     process.env.KNEX_PORT,
        user:     process.env.KNEX_USER,
        password: process.env.KNEX_PASSWORD,
        database: process.env.KNEX_DATABASE,
        filename: process.env.KNEX_FILENAME,
        acquireConnectionTimeout: 10000,
    },
    pool: {
        min: 0,
        max: 10
    },
};

// SSL required?
if (process.env.KNEX_ENCRYPT === 'true' && process.env.KNEX_CLIENT === 'postgres') {
    _.set(config, 'connection.ssl', { rejectUnauthorized: false });
}

if (process.env.KNEX_ENCRYPT === 'true' && process.env.KNEX_CLIENT === 'mssql') {
    _.set(config, 'options.encrypt', true);
}

export default config;
