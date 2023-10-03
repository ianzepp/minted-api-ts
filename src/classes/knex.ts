import knex from 'knex';
import KnexConfig from '@root/knexconfig';

export const KnexDriverFn = () => knex(KnexConfig);
export const KnexDriver = KnexDriverFn();
