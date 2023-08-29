import _ from 'lodash';

// Classes
import { Schema } from '../classes/schema';
import { System } from '../classes/system';

// Types

export type FilterOp = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte' | '$like' | '$nlike' | '$in' | '$nin';
export type FilterGroupingOp = '$and' | '$or' | '$not' | '$nor';
export type FilterType = FilterJson | Filter;

export type FilterWhereClause = {
    [index: string]: FilterWhereCriteria | {
        [key in FilterOp]?: FilterWhereCriteria
    }
} | {
    [key in FilterGroupingOp]?: FilterWhereClause[]
}

export type FilterWhereCriteria = string | string[] | boolean | number | null;

export type FilterOrderClause = {
    [index: string]: 'asc' | 'desc';
}

export interface FilterJson {
    where?: FilterWhereClause | FilterWhereClause[];
    order?: FilterOrderClause | FilterOrderClause[];
    flags?: FilterFlags;
    limit?: number | 'max';
}

export interface FilterConcreteJson extends FilterJson {
    where: FilterWhereClause[];
    order: FilterOrderClause[];
    flags: FilterFlags;
    limit: number;
}

export interface FilterFlags {
    // Include expired records?
    expired?: boolean;

    // Include deleted records? Only applies to root
    deleted?: boolean;
}

// Implementation
export class Filter {
    public static LIMIT_DEFAULT = 100;
    public static LIMIT_MAX = 10000;

    public readonly where: FilterWhereClause[] = [];
    public readonly order: FilterOrderClause[] = [];
    public readonly flags: FilterFlags = {};
    public limit: number = 0;

    constructor(readonly schema: Schema, source: FilterJson = {}) {
        this.fromJSON(source);
    }

    public static isFilter(something: unknown): boolean {
        return something instanceof Filter;
    }

    public static isFilterJson(something: unknown): boolean {
        return _.isPlainObject(something) && (<_.Dictionary<any>> something).where;
    }

    fromJSON(filter_json: FilterJson) {
        // source.where
        if (filter_json.where === undefined) {
            // do nothing
        }

        else if (_.isArray(filter_json.where)) {
            this.where.push(... filter_json.where);
        }

        else if (_.isPlainObject(filter_json.where)) {
            this.where.push(filter_json.where);
        }

        else {
            throw "Unsupported data type for 'where': ${source.where}";
        }

        // source.order
        if (filter_json.order === undefined) {
            // do nothing
        }

        else if (_.isArray(filter_json.order)) {
            this.order.push(... filter_json.order);
        }

        else if (_.isPlainObject(filter_json.order)) {
            this.order.push(filter_json.order);
        }

        else {
            throw "Unsupported data type for 'order': ${source.order}";
        }

        // source.limit
        if (filter_json.limit === undefined) {

        }

        else if (filter_json.limit === 'max') {
            this.limit = Filter.LIMIT_MAX;
        }

        else if (_.isNumber(filter_json.limit)) {
            this.limit = filter_json.limit || 0;
        }

        else {
            throw "Unsupported data type for 'limit': ${source.limit}";
        }
    }

    toJSON(): FilterJson {
        return {
            where: this.where,
            order: this.order,
            flags: this.flags,
            limit: this.limit,
        };
    }
}