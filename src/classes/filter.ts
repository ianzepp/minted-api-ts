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
    limit?: number | 'max';
}

export interface FilterConcreteJson extends FilterJson {
    where: FilterWhereClause[];
    order: FilterOrderClause[];
    limit: number;
}

// Implementation
export class Filter {
    public readonly where: FilterWhereClause[] = [];
    public readonly order: FilterOrderClause[] = [];
    public limit: number = 0;

    constructor(readonly schema: Schema, readonly source: FilterJson = {}) {
        // source.where
        if (source.where === undefined) {
            // do nothing
        }

        else if (_.isArray(source.where)) {
            this.where.push(... source.where);
        }

        else if (_.isPlainObject(source.where)) {
            this.where.push(source.where);
        }

        else {
            throw "Unsupported data type for 'where': ${source.where}";
        }

        // source.order
        if (source.order === undefined) {
            // do nothing
        }

        else if (_.isArray(source.order)) {
            this.order.push(... source.order);
        }

        else if (_.isPlainObject(source.order)) {
            this.order.push(source.order);
        }

        else {
            throw "Unsupported data type for 'order': ${source.order}";
        }

        // source.limit
        if (source.limit === undefined) {

        }

        else if (source.limit === 'max') {
            this.limit = 10000;
        }

        else if (_.isNumber(source.limit)) {
            this.limit = source.limit || 0;
        }

        else {
            throw "Unsupported data type for 'limit': ${source.limit}";
        }
    }

    toJSON(): FilterJson {
        return {
            where: this.where.length ? this.where : undefined,
            order: this.order.length ? this.order : undefined,
            limit: this.limit > 0 ? this.limit : undefined,
        };
    }
}