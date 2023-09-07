import _ from 'lodash';
import { Knex } from 'knex';

// API
import { KnexDriver } from './knex';
import { Filter } from '../classes/filter';
import { System } from '../classes/system';

export class SystemKnex {
    private __transaction: Knex.Transaction | undefined;

    constructor(private readonly __system: System) {

    }

    async startup(): Promise<void> {
        await KnexDriver.raw('SELECT 1'); // test connection at startup
    }

    async transaction(runFn: () => Promise<any>): Promise<any> {
        return KnexDriver.transaction(async tx => {
            this.__transaction = tx;
            return runFn();
        }).finally(() => {
            this.__transaction = undefined;
        });
    }

    // 
    // Raw DB statements
    //

    async select(schema_name: string, columns: string[] = ['*']): Promise<any[]> {
        return this.toTx(schema_name).select(columns);
    }

    // 
    // Build requests
    //

    toTx(schema_name: string) {
        let knex = KnexDriver(schema_name + ' as data');

        if (this.__transaction) {
            knex = knex.transacting(this.__transaction);
        }

        return knex;
    }

    toStatement(schema_name: string) {
        let knex = this.toTx(schema_name);
        let user = this.__system.user;
        let self = this;
        let scopes = _.uniq(_.compact(['system', user.ns, ... user.scopes ?? []]));

        // Inner join the timestamps and acls
        knex = knex.join(schema_name + '_info as info', 'info.id', 'data.id');
        knex = knex.join(schema_name + '_acls as acls', 'acls.id', 'data.id');

        // Apply namespace restrictions
        knex = knex.whereIn('data.ns', scopes);

        // Done
        return knex;
    }

    //
    // Convert a filter object into the proper knex calls
    //

    toStatementFilter(schema_name: string, filter: Filter) {
        let knex = this.toStatement(schema_name);
        let self = this;

        if (filter.flags.expired !== true) {
            knex.whereNull('info.expired_at');            
        }

        if (filter.flags.deleted !== true || this.__system.user.id != System.RootId) {
            knex.whereNull('info.deleted_at');            
        }

        // Iterate where clauses
        knex = knex.where(function() {
            self.toWhereOne(this, filter.where);
        });

        // Set limit
        knex = knex.limit(filter.limit);

        // Done
        return knex;
    }

    // Process where clause data
    private toWhereAll(knex: Knex.QueryBuilder, clauses: _.Dictionary<any>[]) {
        _.forEach(clauses, (clause) => this.toWhereOne(knex, clause));
    }

    private toWhereOne(knex: Knex.QueryBuilder, clause: _.Dictionary<any>) {
        _.forEach(clause, (data, name) => this.toWhereOps(knex, name, data));
    }

    private toWhereOps(knex: Knex.QueryBuilder, name: string, data: any) {
        console.warn('SystemKnex.addFilterWhere: raw-name=%j raw-data=%j', name, data);

        if (name == Filter.Op.And) {
            throw 'Unsupported filter where "$and" grouping';
        }

        else if (name == Filter.Op.Or) {
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

        else if (typeof data === 'boolean') {
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

            else if (op == Filter.Op.Eq && op_data === null) {
                knex.whereNull(name);
            }

            else if (op == Filter.Op.Eq) {
                knex.where(name, '=', op_data);
            }

            else if (op == Filter.Op.NotEq && op_data === null) {
                knex.whereNotNull(name);
            }

            else if (op == Filter.Op.NotEq) {
                knex.where(name, '<>', op_data);
            }

            else if (op == Filter.Op.In && _.isArray(op_data)) {
                knex.whereIn(name, op_data);
            }

            else if (op == Filter.Op.NotIn && _.isArray(op_data)) {
                knex.whereNotIn(name, op_data);
            }

            else if (op == Filter.Op.Gt) {
                knex.where(name, '>', op_data);
            }

            else if (op == Filter.Op.Gte || op == Filter.Op.Min) {
                knex.where(name, '>=', op_data);
            }

            else if (op == Filter.Op.Lt) {
                knex.where(name, '<', op_data);
            }

            else if (op == Filter.Op.Lte || op == Filter.Op.Max) {
                knex.where(name, '<=', op_data);
            }

            else if (op == Filter.Op.Find) {
                // todo pick a LIKE operation
            }

            else {
                throw 'Unknown filter "where" operator: ' + op;
            }
        }

        else {
            throw 'Unknown filter "where" data type: ' + typeof data;
        }
    }

    // private addFilterOrder(knex: Knex.QueryBuilder, clauses: FilterOrderClause[]) {
    //     _.forEach(clauses, clause => {
    //         let [[name, sort]] = Object.entries(clause);

    //         if (sort === 'asc' || sort === 'desc') {
    //             knex.orderBy(name, sort);
    //         }

    //         else {
    //             throw 'Unknown filter "where" sorting: ' + sort;
    //         }
    //     });

    //     return knex;
    // }
}