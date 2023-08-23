import _ from 'lodash';

// API
import { FilterWhereClause } from '../types/filter';
import { FilterOrderClause } from '../types/filter';
import { FilterJson } from '../types/filter';
import { FilterInfo } from '../types/filter';
import { SchemaInfo } from '../types/schema';

// Classes
import { System } from '../classes/system';

export class Filter implements FilterInfo {
    public readonly where: FilterWhereClause[] = [];
    public readonly order: FilterOrderClause[] = [];
    public limit: number = 0;

    constructor(readonly schema: SchemaInfo, readonly source: FilterJson = {}) {
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