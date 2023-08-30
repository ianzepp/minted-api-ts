import _ from 'lodash';
import chai from 'chai';

// Classes
import { Schema } from '../classes/schema';
import { System } from '../classes/system';
import { RecordJson } from './record';

// Helpers
import toJSON from '../helpers/toJSON';

// Types

// export type FilterOp = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte' | '$like' | '$nlike' | '$in' | '$nin';
// export type FilterGroupingOp = '$and' | '$or' | '$not' | '$nor';

// export type FilterType = FilterJson | Filter;

// export type FilterWhereClause = {
//     [index: string]: FilterWhereCriteria | {
//         [key in FilterOp]?: FilterWhereCriteria
//     }
// } | {
//     [key in FilterGroupingOp]?: FilterWhereClause[]
// }

// export type FilterWhereCriteria = string | string[] | boolean | number | null;

// export type FilterOrderClause = {
//     [index: string]: 'asc' | 'desc';
// }

// export interface FilterJson {
//     where?: FilterWhereClause | FilterWhereClause[];
//     order?: FilterOrderClause | FilterOrderClause[];
//     flags?: FilterFlags;
//     limit?: number | 'max';
// }

// export interface FilterConcreteJson extends FilterJson {
//     where: FilterWhereClause[];
//     order: FilterOrderClause[];
//     flags: FilterFlags;
//     limit: number;
// }

// export interface FilterFlags {
//     // Include expired records?
//     expired?: boolean;

//     // Include deleted records? Only applies to root
//     deleted?: boolean;
// }

export class FilterJson {
    where: _.Dictionary<any>;
    order: _.Dictionary<any>;
    flags: _.Dictionary<any>;
    limit: number;
}

export class Filter implements FilterJson {
    public static LimitDefault = 100;
    public static LimitMax = 10000;

    public static OpEq = '$eq';
    public static OpNotEq = '$ne';
    public static OpIn = '$in';
    public static OpNotIn = '$nin';
    public static OpGt = '$gt';
    public static OpGte = '$gte';
    public static OpLt = '$lt';
    public static OpLte = '$lte';

    public static GroupAnd = '$and';
    public static GroupOr = '$or';

    constructor(private readonly source: RecordJson) {
        chai.expect(source).property('type').eq('filter');
        chai.expect(source).property('data');
        chai.expect(source).nested.property('data.schema_name');

        _.defaults(source.data, {
            where: {},
            order: {},
            flags: {},
            limit: Filter.LimitDefault
        });

        chai.expect(source).nested.property('data.where').a('object');
        chai.expect(source).nested.property('data.order').a('object');
        chai.expect(source).nested.property('data.flags').a('object');
        chai.expect(source).nested.property('data.limit').a('number').lte(Filter.LimitMax);
    }

    get schema_name(): string {
        return this.source.data.schema_name;
    }

    get where(): _.Dictionary<any> {
        return this.source.data.where;
    }

    get order(): _.Dictionary<any> {
        return this.source.data.order;
    }

    get flags(): _.Dictionary<any> {
        return this.source.data.flags;
    }

    get limit(): number {
        return this.source.data.limit;
    }

    public static isFilter(something: unknown): boolean {
        return something instanceof Filter;
    }

    public static isFilterJson(something: unknown): boolean {
        return _.isPlainObject(something) && (<_.Dictionary<any>> something).where;
    }

    toJSON(): Partial<RecordJson> {
        return toJSON(_.omit(this.source, ['info', 'acls']));
    }
}