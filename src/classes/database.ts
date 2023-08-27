import chai from 'chai';
import knex from 'knex';
import dotenv from 'dotenv';

// Shared DB connection
dotenv.config();

chai.expect(process.env).property('PGHOST').string;
chai.expect(process.env).property('PGPORT').string;
chai.expect(process.env).property('PGDATABASE').string;

// Define DB options
export const KnexDriverOptions = {
    debug: process.env.PGHOST === 'localhost',
    client: 'pg',
    connection: {
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT, 10),
        database: process.env.PGDATABASE
    }
}

// Create the driver reference
export const KnexDriver = knex(KnexDriverOptions);


