import _ from 'lodash';
import { Knex } from 'knex';

// API
import { KnexDriver } from './knex';
import { Filter } from '../classes/filter';
import { System } from '../classes/system';
import { RecordData } from '../classes/record';

export class SystemKnex {
    private __transaction: Knex.Transaction | undefined;

    constructor(private readonly __system: System) {}

    async startup(): Promise<void> {
        await KnexDriver.raw('SELECT 1'); // test connection at startup
    }

    async destroy(): Promise<void> {
        await KnexDriver.destroy();
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

    async select(schema_name: string, columns: string[] = ['*']) {
        return this.toTx(schema_name).select(columns) as Promise<RecordData[]>;
    }

    // 
    // Build requests
    //

    toTx(schema_name: string, alias?: string) {
        let knex;
        
        if (typeof alias === 'string') {
            knex = KnexDriver(schema_name + ' as ' + alias);
        }

        else {
            knex = KnexDriver(schema_name);
        }
        
        if (this.__transaction) {
            knex = knex.transacting(this.__transaction);
        }

        return knex;
    }

    toStatement(schema_name: string) {
        let knex = this.toTx(schema_name, 'data');

        // Visibility
        knex = knex.whereIn('data.ns', this.__system.namespaces);

        // Inner join the timestamps and acls
        knex = knex.join(schema_name + '_info as info', 'info.id', 'data.id');
        knex = knex.join(schema_name + '_acls as acls', 'acls.id', 'data.id');
                
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
            knex.where('data.' + name, data);
        }

        else if (typeof data === 'number') {
            knex.where('data.' + name, data);
        }

        else if (typeof data === 'boolean') {
            knex.where('data.' + name, data);
        }

        else if (_.isArray(data)) {
            knex.whereIn('data.' + name, data);
        }

        else if (_.isPlainObject(data)) {
            let [[op, op_data]] = Object.entries(data);

            if (typeof op !== 'string') {
                throw 'Invalid filter "where" operation type: ' + typeof op;
            }

            else if (op == Filter.Op.Eq && op_data === null) {
                knex.whereNull('data.' + name);
            }

            else if (op == Filter.Op.Eq) {
                knex.where('data.' + name, '=', op_data);
            }

            else if (op == Filter.Op.NotEq && op_data === null) {
                knex.whereNotNull('data.' + name);
            }

            else if (op == Filter.Op.NotEq) {
                knex.where('data.' + name, '<>', op_data);
            }

            else if (op == Filter.Op.In && _.isArray(op_data)) {
                knex.whereIn('data.' + name, op_data);
            }

            else if (op == Filter.Op.NotIn && _.isArray(op_data)) {
                knex.whereNotIn('data.' + name, op_data);
            }

            else if (op == Filter.Op.Gt) {
                knex.where('data.' + name, '>', op_data);
            }

            else if (op == Filter.Op.Gte || op == Filter.Op.Min) {
                knex.where('data.' + name, '>=', op_data);
            }

            else if (op == Filter.Op.Lt) {
                knex.where('data.' + name, '<', op_data);
            }

            else if (op == Filter.Op.Lte || op == Filter.Op.Max) {
                knex.where('data.' + name, '<=', op_data);
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