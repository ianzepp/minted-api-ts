import _ from 'lodash';

// API
import { ColumnInfo } from '../types/column';
import { ColumnName } from '../types/column';

// Classes
export class Column implements ColumnInfo {
    readonly name: string;
    readonly description: string;

    constructor(column_source: ColumnInfo) {
        this.name = column_source.name;
        this.description = column_source.description;
    }
}