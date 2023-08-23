import _ from 'lodash';

// API
import { ChangeData } from '../types/record';
import { FilterJson } from '../types/filter';
import { FilterInfo } from '../types/filter';
import { RecordInfo } from '../types/record';
import { SchemaInfo } from '../types/schema';
import { ColumnInfo } from '../types/column';
import { SchemaName } from '../types/schema';

// Classes
import { Column } from '../classes/column';

export class Schema implements SchemaInfo {
    readonly name: string;
    readonly description: string;
    readonly columns: ColumnInfo[];

    constructor(schema_source: SchemaInfo, column_list: ColumnInfo[] = []) {
        this.name = schema_source.name;
        this.description = schema_source.description;

        // Generate columns
        this.columns = column_list.map(source => new Column(source));
    }
}