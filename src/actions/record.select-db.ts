import _, { cond } from 'lodash';
import { Knex } from 'knex';

// Classes
import { Action } from '@root/src/classes/action';
import { Signal } from '@classes/signal';
import { Filter } from '@classes/filter';

// Typedefs
import { ActionRing } from '@root/src/typedefs/action';
import { Object } from '@classes/object';
import { Kernel } from '@classes/kernel';


export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return '*';
    }

    onRing(): ActionRing {
        return ActionRing.Database;
    }

    onSelect(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        let object = signal.object;
        let knex = signal.kernel.data.selectTo(object.object_name);

        // Filter out expired and deleted records
        knex = knex.whereNull('meta.expired_at');
        knex = knex.whereNull('meta.deleted_at');
        
        // Build `filter.where` conditions
        knex = this.whereOne(knex, signal.filter.where);

        // Add the ACL conditions
        // knex = this.whereAcl(knex, signal.kernel);

        // Build `filter.order` conditions
        knex = this.order(knex, signal.filter.order);

        // Build `filter.limit`
        knex = this.limit(knex, signal.filter.limit);

        // Build the list of columns. Based on internal visibility
        knex = this.columns(knex, signal.object);

        // Wait for the result
        let result = await knex;

        // Convert the raw results into records
        let select = _.map(result, record_flat => signal.object.toRecord(record_flat));

        // Reset change list and add to results
        signal.change.length = 0;
        signal.change.push(... select);
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

        // 
        let [[op, op_data]] = _.toPairs(data);

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
            return knex.whereLike(column_name, op_data);
        }

        throw 'Unknown filter "where" operator: ' + op;
    }

    private whereAcl(knex: Knex.QueryBuilder, kernel: Kernel) {
        //
        // NOTE: This was moved to RLS in PG directly. See `Autoinstall`
        //


        // if (kernel.isRoot()) {
        //     return;
        // }

        // // The record ACLs live in the `<object_name>__meta` table as:
        // // - access_full UUID[]
        // // - access_edit UUID[]
        // // - access_read UUID[]
        // // - access_deny UUID[]
        // //
        // // Each user has a user ID (found in `system.user_id`)
        // //
        // // The following rules define whether a user can access a record or not (in this order):
        // // 1. If the user's ID is in `access_deny`, then no.
        // // 2. If the user's ID is in `access_full`, or `access_edit`, or `access_read`, then yes.
        // // 3. If all of `access_full`, `access_edit`, and `access_read` are `null`, then yes.

        // let user_id = kernel.user_id;

        // // Handle the deny case
        // knex = knex.where(function() {
        //     this.whereRaw('NOT meta.access_deny @> ARRAY[?]::uuid[]', [user_id]);
        //     this.orWhereNull('meta.access_deny');
        // });

        // // Handle the view case
        // knex = knex.where(function() {
        //     this.whereRaw('meta.access_full @> ARRAY[?]::uuid[]', [user_id]);
        //     this.orWhereRaw('meta.access_edit @> ARRAY[?]::uuid[]', [user_id]);
        //     this.orWhereRaw('meta.access_read @> ARRAY[?]::uuid[]', [user_id]);
        //     this.orWhere(function() {
        //         this.whereNull('meta.access_full');
        //         this.whereNull('meta.access_edit');
        //         this.whereNull('meta.access_read');
        //     });
        // });

        // console.warn('query', knex.toSQL());

        // // Done
        // return knex;
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

    private columns(knex: Knex.QueryBuilder, object: Object) {
        // Required columns
        knex = knex.column(['data.id', 'data.ns']);

        // Meta columns
        knex = knex.column(['meta.*']);

        // Object visible columns
        knex = knex.column(object.keys('data'));

        // Done
        return knex;
    }
}