import pgPromise from 'pg-promise';

export const DatabaseDriver = pgPromise();
export const DatabaseHelper = DatabaseDriver.helpers;
export const Database = DatabaseDriver({
    host: 'localhost',
    port: 5432,
    database: 'minted-api-dev'
});
