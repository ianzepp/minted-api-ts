import chai from 'chai';
import knex from 'knex';
import dotenv from 'dotenv';

// Create the driver reference
export const KnexDriver = knex({
    debug: process.env.POSTGRES_DEBUG === 'true',
    client: 'postgresql',
    connection: {
        host:     process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        user:     process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    },
    pool: {
        min: 2,
        max: 10
    }
});


