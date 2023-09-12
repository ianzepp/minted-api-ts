import _, { cond } from 'lodash';
import { Knex } from 'knex';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { Filter } from '@classes/filter';

// Layouts
import { ObserverRing } from '@layouts/observer';
import { Schema } from '@classes/schema';


export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return '*';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
    }

    onSelect(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        let schema = flow.schema;
        let knex = flow.system.knex.selectTo(schema.schema_name);

        // Filter out expired and deleted records
        knex = knex.whereNull('meta.expired_at');
        knex = knex.whereNull('meta.deleted_at');
        
        // Build `filter.where` conditions
        knex = this.whereOne(knex, flow.filter.where);

        // Build `filter.order` conditions
        knex = this.order(knex, flow.filter.order);

        // Build `filter.limit`
        knex = this.limit(knex, flow.filter.limit);

        // Build the list of columns. Based on internal visibility
        knex = this.columns(knex, flow.schema);

        // Wait for the result
        let result = await knex;

        // Convert the raw results into records
        let select = _.map(result, record_flat => flow.schema.toRecord(record_flat));

        // Reset change list and add to results
        flow.change.length = 0;
        flow.change.push(... select);
    }

    private whereAll(knex: Knex.QueryBuilder, conditions: _.Dictionary<any>[] = [], group: '$and' | '$or' = '$and') {
        // console.warn('this.whereAll()', group, conditions);
        let self = this;

        return knex.where(function() {
            for(let i = 0; i < conditions.length; i++) {
                let clause = conditions[0];
                
                function callFn() {
                    self.whereOne(this, clause);
                }

                if (i === 0 || group === '$and') {
                    this.where(callFn)
                }

                else if (group === '$or') {
                    this.orWhere(callFn);
                }

                else {
                    // ?
                }
            }
        });
    }

    private whereOne(knex: Knex.QueryBuilder, clause: _.Dictionary<any> = {}) {
        // console.warn('this.where()', clause);

        for(let name in clause) {
            let data = clause[name];

            knex = this.whereOp(knex, name, data)
        }

        return knex;
    }

    private whereOp(knex: Knex.QueryBuilder, name: string, data: any) {
        // console.warn('this.whereOp()', name, data);

        if (name == Filter.Group.And) {
            return this.whereAll(knex, data, '$and');
        }

        if (name == Filter.Group.Or) {
            return this.whereAll(knex, data, '$or');
        }

        if (name.startsWith('$')) {
            throw 'Unknown filter where grouping: ' + name;
        }

        //
        // Start checking simple cases
        //

        let column_name = 'data.' + name;

        if (data === null) {
            return knex.whereNull(column_name);
        }

        if (typeof data === 'string') {
            return knex.where(column_name, data);
        }

        if (typeof data === 'number') {
            return knex.where(column_name, data);
        }

        if (typeof data === 'boolean') {
            return knex.where(column_name, data);
        }

        if (_.isArray(data)) {
            return knex.whereIn(column_name, data);
        }

        //
        // Parse operations embedded in dictionary data types. Anthing that is
        // not wrapped in a dictionary type is automatically an error.
        //

        if (_.isPlainObject(data) === false) {
            throw 'Unknown filter "where" data type: ' + typeof data;
        }

        let [[op, op_data]] = Object.entries(data);

        if (typeof op !== 'string') {
            throw 'Invalid filter "where" operation type: ' + typeof op;
        }

        if (op == Filter.Where.Not && op_data === null) {
            return knex.whereNotNull(column_name);
        }

        if (op == Filter.Where.Not || op == Filter.Where.Neq) {
            return knex.whereNot(column_name, op_data);
        }

        if (op == Filter.Where.Eq && op_data === null) {
            return knex.whereNull(column_name);
        }

        if (op == Filter.Where.Eq) {
            return knex.where(column_name, '=', op_data);
        }

        if (op == Filter.Where.Neq && op_data === null) {
            return knex.whereNotNull(column_name);
        }

        if (op == Filter.Where.Neq) {
            return knex.where(column_name, '<>', op_data);
        }

        if (op == Filter.Where.In && _.isArray(op_data)) {
            return knex.whereIn(column_name, op_data);
        }

        if (op == Filter.Where.Nin && _.isArray(op_data)) {
            return knex.whereNotIn(column_name, op_data);
        }

        if (op == Filter.Where.Gt) {
            return knex.where(column_name, '>', op_data);
        }

        if (op == Filter.Where.Gte || op == Filter.Where.Min) {
            return knex.where(column_name, '>=', op_data);
        }

        if (op == Filter.Where.Lt) {
            return knex.where(column_name, '<', op_data);
        }

        if (op == Filter.Where.Lte || op == Filter.Where.Max) {
            return knex.where(column_name, '<=', op_data);
        }

        if (op == Filter.Where.Find) {
            return knex.whereILike(column_name, op_data);
        }

        throw 'Unknown filter "where" operator: ' + op;
    }


    private order(knex: Knex.QueryBuilder, clauses: _.Dictionary<any> = {}) {
        _.each(clauses, (sort, column_name) => {
            sort = sort || '';
            sort = sort.toLowerCase().trim();

            if (sort === 'asc' || sort === 'desc') {
                knex = knex.orderBy(column_name, sort);
            }
        });

        return knex;
    }

    private limit(knex: Knex.QueryBuilder, limit: number | undefined) {
        if (limit === undefined) {
            limit = Filter.LimitDefault;
        }

        if (limit > Filter.LimitMaximum) {
            limit = Filter.LimitMaximum;
        }

        if (limit < Filter.LimitMinimum) {
            limit = Filter.LimitMinimum;
        }

        return knex.limit(limit);
    }

    private columns(knex: Knex.QueryBuilder, schema: Schema) {
        // Required columns
        knex = knex.column(['data.id', 'data.ns']);

        // Meta columns
        knex = knex.column(['meta.*']);

        // Schema visible columns
        knex = knex.column(schema.column_keys('data'));

        // Done
        return knex;
    }
}