import _ from 'lodash';
import { Knex } from 'knex';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Filter } from '../classes/filter';

// Layouts
import { ObserverRing } from '../layouts/observer';


export default class extends Observer {
    toName(): string {
        return 'record.knex-select';
    }
    
    onSchema(): string {
        return 'record';
    }

    onRing(): ObserverRing {
        return ObserverRing.Knex;
    }

    onSelect(): boolean {
        return true;
    }

    async run(flow: ObserverFlow): Promise<void> {
        let schema_name = flow.schema.schema_name;
        let knex = flow.system.knex.toTx(`system_data.${schema_name} as data`);

        // Join meta and acls
        knex = knex.join(`system_meta.${schema_name} as meta`, 'meta.id', 'data.id');
        knex = knex.join(`system_acls.${schema_name} as acls`, 'acls.id', 'data.id');

        // Filter to visible namespaces
        knex = knex.whereIn('data.ns', flow.system.namespaces);

        // Filter out expired and deleted records
        knex = knex.whereNull('meta.expired_at');
        knex = knex.whereNull('meta.deleted_at');
        
        // Filter out ACLs 
        // knex = knex.whereNotIn('acls.acls_deny', [flow.system.user.id]);

        // Build `filter.where` conditions
        knex = this.where(knex, flow.filter.where);

        // Build `filter.order` conditions
        // knex = this.order(knex, flow.filter.order);

        // Build `filter.limit`
        knex = this.limit(knex, flow.filter.limit);

        // Wait for the result
        let result = await knex;

        // Convert the raw results into records
        let select = _.map(result, record_flat => flow.schema.toRecord(record_flat));

        // Reset change list and add to results
        flow.change.length = 0;
        flow.change.push(... select);
    }

    private where(knex: Knex.QueryBuilder, clause: _.Dictionary<any> | undefined) {
        if (clause === undefined) {
            return knex;
        }

        _.forEach(clause, (data, name) => this.whereOps(knex, name, data));
        return knex;
    }

    private whereAnd(knex: Knex.QueryBuilder, data: any) {
        throw 'Unsupported filter where "$and" grouping';
    }

    private whereOr(knex: Knex.QueryBuilder, data: any) {
        throw 'Unsupported filter where "$and" grouping';
    }

    private whereOps(knex: Knex.QueryBuilder, name: string, data: any) {
        if (name == Filter.Group.And) {
            return this.whereAnd(knex, data);
        }

        if (name == Filter.Group.Or) {
            return this.whereOr(knex, data);
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

        throw 'Unknown filter "where" operator: ' + op;
    }

    private order(knex: Knex.QueryBuilder, clauses: _.Dictionary<any> | undefined) {
        if (clauses === undefined) {
            return knex;
        }

        let [[name, sort]] = Object.entries(clauses);

        if (sort === 'asc' || sort === 'desc') {
            return knex.orderBy(name, sort);
        }

        throw 'Unknown filter "order" sorting: ' + sort;
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
}