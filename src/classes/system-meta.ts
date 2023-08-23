import _ from 'lodash';

// API
import { ChangeData } from '../types/record';
import { FilterInfo } from '../types/filter';
import { FilterJson } from '../types/filter';
import { RecordInfo } from '../types/record';
import { SchemaInfo } from '../types/schema';
import { ColumnInfo } from '../types/column';
import { SchemaName } from '../types/schema';
import { SchemaType } from '../types/schema';

// Classes
import { Schema } from '../classes/schema';
import { System } from '../classes/system';
import { Record } from '../classes/record';
import { Filter } from '../classes/filter';

const SCHEMAS_PROXY_HANDLER = {
    get: (t: SystemMeta, p: string | number | symbol) => {
        if (typeof p === 'string') {
            return t.toSchema(p);
        }
    }
};

export class SystemMeta {
    // Cache known schema names
    private readonly _schema_dict: _.Dictionary<SchemaInfo> = {};

    constructor(private readonly system: System) {
        // Initialize the core schemas
        this.__insert_schema({ name: 'schema', description: null }, [
            { name: 'name', description: null }, 
            { name: 'description', description: null }
        ]);
        
        this.__insert_schema({ name: 'column', description: null }, [
            { name: 'name', description: null }, 
            { name: 'description', description: null }
        ]);
    }

    /** Convert a schema string name into the loaded instance */
    toSchema(schema_name: string): SchemaInfo {
        let schema = this._schema_dict[schema_name];

        if (schema === undefined) {
            throw "Unknown schema '${schema_name}";
        }

        return schema;
    }

    toSchemaSafe(p: string | number | symbol) {
        return typeof p === 'string' ? this.toSchema(p) : undefined;
    }

    toFilter(schema_name: string, filter_data?: FilterJson): FilterInfo {
        return new Filter(this.toSchema(schema_name), filter_data);
    }

    toRecord(schema_name: string, record_data?: ChangeData): RecordInfo {
        return new Record(this.toSchema(schema_name), record_data);
    }

    //
    // Internals
    //

    private __insert_schema(schema_source: SchemaInfo, column_source: ColumnInfo[]) {
        let schema = new Schema(schema_source, column_source);

        // Add to internal tracking
        this._schema_dict[schema.name] = schema;

        console.warn("SystemMeta: added schema '%s' with %d columns: %j", 
            schema.name,
            schema.columns.length,
            schema.columns.map(column => column.name)
        );
    }

}