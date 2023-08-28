import _ from 'lodash';
import { Knex } from 'knex';

// API
import { KnexDriver } from '../classes/database';
import { Filter } from '../classes/filter';
import { FilterWhereClause } from '../classes/filter';
import { FilterOrderClause } from '../classes/filter';
import { Schema } from '../classes/schema';
import { System } from '../classes/system';

export class SystemKnex {
    private _transaction: Knex.Transaction | undefined;

    constructor(private readonly system: System) {}

    async startup() {
        await KnexDriver.raw('SELECT 1'); // test connection at startup
    }

    async transaction(runFn: () => Promise<any>) {
        return KnexDriver.transaction(async tx => {
            this._transaction = tx;
            return runFn();
        }).finally(() => {
            this._transaction = undefined;
        });
    }

    toKnex(schema_name: string) {
        let knex = KnexDriver(schema_name + ' as data');

        if (this._transaction) {
            knex = knex.transacting(this._transaction);
        }

        return knex;
    }

    toStatement(schema: Schema, filter?: Filter) {
        let knex = this.toKnex(schema.name);
        let user = this.system.user;
        let self = this;

        if (filter === undefined) {
            filter = new Filter(schema);
        }

        // Inner join the timestamps and acls
        knex = knex.join('metainfo as info', 'info.id', 'data.id');

        // Apply all of the system restrictions in a single group
        knex = knex.where(function() {
            this.where(function() {
                this.whereNull('data.ns').orWhereIn('data.ns', user.ns);
            });
    
            this.where(function() {
                this.whereNull('data.sc').orWhereIn('data.sc', user.sc);
            });

            if (filter.flags.expired !== true) {
                this.whereNull('info.expired_at');            
            }
    
            if (filter.flags.deleted !== true || user.id !== System.UUIDZERO) {
                this.whereNull('info.deleted_at');            
            }
        });

        // Process where clauses
        knex = knex.where(function() {
            self.to_where(this, filter.where);
        });

        // Process order clauses
        knex = this.addFilterOrder(knex, filter.order);

        // Process limit
        knex = knex.limit(filter.limit || Filter.LIMIT_DEFAULT);

        return knex;
    }

    // Process where clause data
    private to_where(knex: Knex.QueryBuilder, clauses: FilterWhereClause[]) {
        let self = this;

        _.forEach(clauses, clause => {
            _.forEach(clause, (data, name) => {
                console.warn('SystemKnex.addFilterWhere: raw-name=%j raw-data=%j', name, data);

                if (name === '$and') {
                    throw 'Unsupported filter where "$and" grouping';
                }

                else if (name === '$or') {
                    throw 'Unsupported filter where "$or" grouping';
                }

                else if (name.startsWith('$')) {
                    throw 'Unknown filter where grouping: ' + name;
                }

                else if (data === null) {
                    knex.whereNull(name);
                }

                else if (typeof data === 'string') {
                    knex.where(name, data);
                }

                else if (typeof data === 'number') {
                    knex.where(name, data);
                }

                else if (data === true || data === false) {
                    knex.where(name, data);
                }

                else if (_.isArray(data)) {
                    knex.whereIn(name, data);
                }

                else if (_.isPlainObject(data)) {
                    let [[op, op_data]] = Object.entries(data);

                    if (typeof op !== 'string') {
                        throw 'Invalid filter "where" operation type: ' + typeof op;
                    }

                    else if (op === '$and' && _.isArray(op_data)) {
                        knex.where(function() { 
                            self.to_where(this, op_data as FilterWhereClause[]);
                        });
                    }

                    else if (op === '$or' && _.isArray(op_data)) {
                        knex.orWhere(function() { 
                            self.to_where(this, op_data as FilterWhereClause[]);
                        });
                    }

                    else if (op === '$eq' && op_data === null) {
                        knex.whereNull(name);
                    }

                    else if (op === '$eq') {
                        knex.where(name, '=', op_data);
                    }

                    else if (op === '$ne' && op_data === null) {
                        knex.whereNotNull(name);
                    }

                    else if (op === '$ne') {
                        knex.where(name, '<>', op_data);
                    }

                    else if (op === '$in' && _.isArray(op_data)) {
                        knex.whereIn(name, op_data);
                    }

                    else if (op === '$nin' && _.isArray(op_data)) {
                        knex.whereNotIn(name, op_data);
                    }

                    else if (op === '$gt') {
                        knex.where(name, '>', op_data);
                    }

                    else if (op === '$gte' || op === '$min') {
                        knex.where(name, '>=', op_data);
                    }

                    else if (op === '$lt') {
                        knex.where(name, '<', op_data);
                    }

                    else if (op === '$lte' || op === '$max') {
                        knex.where(name, '<=', op_data);
                    }

                    else if (op === '$find') {
                        // todo pick a LIKE operation
                    }

                    else {
                        throw 'Unknown filter "where" operator: ' + op;
                    }
                }

                else {
                    throw 'Unknown filter "where" data type: ' + typeof data;
                }
            });
        });
    }

    private addFilterOrder(knex: Knex.QueryBuilder, clauses: FilterOrderClause[]) {
        _.forEach(clauses, clause => {
            let [[name, sort]] = Object.entries(clause);

            if (sort === 'asc' || sort === 'desc') {
                knex.orderBy(name, sort);
            }

            else {
                throw 'Unknown filter "where" sorting: ' + sort;
            }
        });

        return knex;
    }
}