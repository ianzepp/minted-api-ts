import _ from 'lodash';
import chai from 'chai';

// Classes
import { Schema } from '@classes/schema';
import { System } from '@classes/system';
import { Record } from '@classes/record';

// Layouts
import { FilterGroup } from '@layouts/filter';
import { FilterOrder } from '@layouts/filter';
import { FilterWhere } from '@layouts/filter';
import { FilterInfo } from '@layouts/filter';
import { FilterJson } from '@layouts/filter';
import { SchemaName } from '@layouts/schema';

// Helpers
import toJSON from '@helpers/toJSON';


export class Filter implements FilterInfo {
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

    constructor(public readonly using: SchemaName, source?: Partial<FilterJson>) {
        _.assign(this.where, source?.where);
        _.assign(this.order, source?.order);
        _.assign(this.flags, source?.flags);

        // Set the limit
        this.limit = source?.limit || Filter.LimitDefault;
    }

    toJSON(): FilterJson {
        return toJSON({
            using: this.using,
            where: this.where,
            order: this.order,
            flags: this.flags,
            limit: this.limit,
        });
    }
}