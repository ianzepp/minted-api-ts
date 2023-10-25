import { v4 as uuid } from 'uuid';
import knex, { Knex } from 'knex';
import KnexConfig from '@src/knexconfig';
import { Kernel } from '@kernel/classes/kernel';

export const KnexDriverFn = () => knex(KnexConfig);
export const KnexDriver = KnexDriverFn();
