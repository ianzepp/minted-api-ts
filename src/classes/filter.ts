import _ from 'lodash';
import chai from 'chai';

// Classes
import { Schema } from '../classes/schema';
import { System } from '../classes/system';
import { Record } from '../classes/record';

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

export enum FilterOp {
    And = '$and',
    Eq = '$eq',
    Gt = '$gt',
    Gte = '$gte',
    Find = '$find',
    In = '$in',
    Lt = '$lt',
    Lte = '$lte',
    Max = '$max',
    Min = '$min',
    Not = '$not',
    Nor = '$nor',
    Neq = '$ne',
    Nin = '$nin',
    Or = '$or',
}

export interface FilterJson {
    where: _.Dictionary<any>;
    order: _.Dictionary<any>;
    flags: _.Dictionary<any>;
    limit: number;
}

export class Filter implements FilterJson {
    public static LimitDefault = 100;
    public static LimitMaximum = 10000;
    public static LimitMinimum = 0;

    // Re-export aliases
    public static Op = FilterOp;

    // Default values
    public readonly where: _.Dictionary<any> = {};
    public readonly order: _.Dictionary<any> = {};
    public readonly flags: _.Dictionary<any> = {};
    public limit: number = Filter.LimitDefault;

    constructor(public readonly schema: Schema, source?: Partial<FilterJson>) {
        _.assign(this.where, source?.where);
        _.assign(this.order, source?.order);
        _.assign(this.flags, source?.flags);
        _.assign(this.limit, source?.limit);
    }

    toJSON(): FilterJson {
        return toJSON({
            where: this.where,
            order: this.order,
            flags: this.flags,
            limit: this.limit,
        });
    }
}