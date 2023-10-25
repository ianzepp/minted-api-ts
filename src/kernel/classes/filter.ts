import _ from 'lodash';
import chai from 'chai';

// Typedefs
import { FilterGroup } from '@system/typedefs/filter';
import { FilterOrder } from '@system/typedefs/filter';
import { FilterWhere } from '@system/typedefs/filter';
import { FilterJson } from '@system/typedefs/filter';
import { toJSON } from '@system/classes/helper';

export class Filter implements FilterJson {
    // Static values
    public static LimitDefault = 100;
    public static LimitMaximum = 10000;
    public static LimitMinimum = 0;

    // Re-export aliases
    public static Group = FilterGroup;
    public static Order = FilterOrder;
    public static Where = FilterWhere;

    // Default values
    public readonly where: _.Dictionary<any> = {};
    public readonly order: _.Dictionary<any> = {};
    public readonly flags: _.Dictionary<any> = {};
    public limit: number = Filter.LimitDefault;

    constructor(source: Partial<FilterJson> = {}) {
        _.assign(this.where, source.where);
        _.assign(this.order, source.order);
        _.assign(this.flags, source.flags);

        // Set the limit
        this.limit = source.limit ?? Filter.LimitDefault;
    }
}