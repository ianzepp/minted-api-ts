import _ from 'lodash';
import chai from 'chai';

// Layouts
import { FilterGroup } from '@layouts/filter';
import { FilterOrder } from '@layouts/filter';
import { FilterWhere } from '@layouts/filter';
import { FilterJson } from '@layouts/filter';
import { toJSON } from '@classes/helpers';

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