import _ from 'lodash';

// Typedefs
import { ObjectName } from './object';


//
// Types
//

/** The filter operations for either 'where' or 'group' logic. */
export type FilterOp = FilterGroup | FilterOrder | FilterWhere;


//
// Enums
//

/** The filter operations that can be conducted for 'group' logic. */
export enum FilterGroup {
    And = '$and',
    Nor = '$nor',
    Not = '$not',
    Or = '$or',
}

/** The filter operation that can be conducted for 'order' logic. */
export enum FilterOrder {
    Asc = '$asc',
    Desc = '$desc',
}

/** The filter operations that can be conducted for 'where' logic. */
export enum FilterWhere {
    Eq = '$eq',
    Find = '$find',
    Gt = '$gt',
    Gte = '$gte',
    In = '$in',
    Lt = '$lt',
    Lte = '$lte',
    Max = '$max',
    Min = '$min',
    Neq = '$ne',
    Nin = '$nin',
    Not = '$not',
}


//
// Interfaces
//

/** Represents the flags to be checked for in a filter operation. */
export interface FilterFlags {
    // Include expired records?
    expired?: boolean;

    // Include deleted records? Only applies to root
    deleted?: boolean;
}

/** Represents the filter's JSON representation in object format. */
export interface FilterJson {
    where: _.Dictionary<any>;
    order: _.Dictionary<any>;
    flags: _.Dictionary<any>;
    limit: number;
}

/** Represents the filter's JSON representation in object format. */
// export interface FilterJson {
//     using: ObjectName;
//     where: _.Dictionary<FilterWhere>;
//     order: _.Dictionary<FilterOrder>;
//     flags: _.Dictionary<FilterFlags>;
//     limit: number;
// }

/** Represents the architecture needed to obtain a filter's info. */
export interface FilterInfo extends FilterJson {
    /** Proxy to `system.data.selectAll()` */
    // selectAll(): Promise<RecordInfo[]>;

    /** Proxy to `system.data.selectOne()` */
    // selectOne(): Promise<RecordInfo | undefined>;

    /** Proxy to `system.data.select404()` */
    // select404(): Promise<RecordInfo>;
}
