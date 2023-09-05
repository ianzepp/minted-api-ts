import chai from 'chai';
import knex from 'knex';
import dotenv from 'dotenv';

// Knex configurations
chai.expect(process.env).property('DATABASE_URL').string;

// Create the driver reference
export const KnexDriver = knex({
    client: 'postgresql',
    connection: process.env.DATABASE_URL
});


