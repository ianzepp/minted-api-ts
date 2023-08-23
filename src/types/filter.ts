
import { RecordInfo } from './record';
import { SchemaName } from './schema';
import { SchemaInfo } from './schema';

export type FilterOp = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte' | '$like' | '$nlike' | '$in' | '$nin';
export type FilterGroupingOp = '$and' | '$or' | '$not' | '$nor';
export type FilterType = FilterJson | FilterInfo;

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

export interface FilterInfo extends FilterConcreteJson {
    /** Returns the parent schema table name for this filter */
    readonly schema: SchemaInfo;
}