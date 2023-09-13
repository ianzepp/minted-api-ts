import _ from 'lodash';

// Classes
import { Filter } from '@classes/filter';
import { Schema } from '@classes/schema';
import { Column } from '@classes/column';
import { Record } from '@classes/record';
import { RecordFlat } from '@layouts/record';
import { System } from '@classes/kernel';
import { SystemService } from '@classes/kernel';

// Meta API errors
export class MetaError extends Error {};
export class SchemaNotFoundError extends MetaError {};
export class ColumnNotFoundError extends MetaError {};

// Helpers
import { toJSON } from '@classes/helpers';
import { SchemaType } from './schema-type';

// Extract the predefined list of schema names
export const SystemSchemaTypes = _.values(SchemaType) as string[];

// Implementation
export class SystemMeta implements SystemService {
    // Source data for known schema and column names
    public readonly sources: Map<string, RecordFlat[]> = new Map();
    public readonly schemas: MapSchemas;
    public readonly columns: MapColumns;

    constructor(private readonly system: System) {
        this.schemas = new MapSchemas(system);
        this.columns = new MapColumns(system);
    }

    /**
     * The `startup` method loads all the core metadata from the DB into a local
     * service cache. At present, it does the following:
     * 
     * 1. Load all `system.schema` records
     * 2. Load all `system.column` records
     * 
     * Once the data is here, we store it in the metadata cache.
     */

    async startup(): Promise<void> {
        this.system.emit('system-meta', 'startup');

        // Instantiate
        for(let source of await this.load(SchemaType.Schema)) {
            let schema = new Schema(source);

            // Install
            this.schemas.set(source.schema_name, schema);
        }

        // Instantiate
        for(let source of await this.load(SchemaType.Column)) {
            let schema = this.schemas.get(source.schema_name);
            let column = new Column(source);

            // Install
            this.columns.set(column.column_path, column);

            // Cross reference
            schema.columns.set(source.column_name, column);
        }
    }
    
    async cleanup(): Promise<void> {
        this.sources.clear();
        this.schemas.clear();
        this.columns.clear();
    }

    async refresh() {
        await this.cleanup();
        await this.startup();
    }

    async describe() {
        
    }

    //
    // Metadata source helpers
    //

    async load(schema_path: string) {
        let sources = await this.system.knex
            .selectTo<RecordFlat>(schema_path)
            .whereNull('meta.expired_at')
            .whereNull('meta.deleted_at')
            .select();

        // Save the results
        this.sources.set(schema_path, sources);

        // Done
        return sources;
    }
    

    find_source(schema_path: string, match: string, k: string = 'name') {
        return _.find(this.sources.get(schema_path), source => {
            return source[k] === match;
        });
    }

    find_schema(schema_name: string) {
        return _.find(this.sources.get(SchemaType.Schema), source => {
            return source.schema_name === schema_name;
        });
    }

    find_column(schema_name: string, column_name: string) {
        return _.find(this.sources.get(SchemaType.Column), source => {
            return source.schema_name === schema_name
                && source.column_name === column_name;
        });
    }
}

//
// Proxy for mapping schemas
//

export class MapSchemas extends Map<string, Schema> {
    constructor(private system: System) {
        super();
    }

    get(schema_name: Schema | string) {
        // Already a Schema instance? Nothing needed..
        if (schema_name instanceof Schema) {
            return schema_name;
        }

        // It must be at least a string
        if (typeof schema_name !== 'string') {
            throw new SchemaNotFoundError(schema_name as string);

        }

        // Convert the string to lower-case and clean it up
        schema_name = schema_name.toLowerCase().trim();

        // Try to find a fully-qualified name
        let schema: Schema | undefined;

        if (schema_name.includes('.')) {
            schema = super.get(schema_name);
        }

        // Try to find the schema with a `system` prefix for known schemas
        else if (SystemSchemaTypes.includes(`system.${schema_name}`)) {
            schema = super.get(`system.${schema_name}`);
        }

        // Try to find the schema in the user's namespace
        else {
            schema = super.get(`${this.system.user_ns}.${schema_name}`);
        }
        
        // Moment of truth..
        if (schema === undefined) {
            throw new SchemaNotFoundError(schema_name as string);
        }

        return schema;        
    }
}

export class MapColumns extends Map<string, Column> {
    constructor(private system: System) {
        super();
    }
}
