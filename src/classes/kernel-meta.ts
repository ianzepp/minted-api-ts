import _ from 'lodash';

// Classes
import { Filter } from '@classes/filter';
import { Schema } from '@classes/schema';
import { Column } from '@classes/column';
import { Record } from '@classes/record';
import { Kernel } from '@classes/kernel';
import { toJSON } from '@classes/helpers';

// Typedefs
import { Service } from '@typedefs/kernel';
import { RecordFlat } from '@typedefs/record';
import { SchemaType } from '@typedefs/schema';


// Meta API errors
export class MetaError extends Error {};
export class SchemaNotFoundError extends MetaError {};
export class ColumnNotFoundError extends MetaError {};

// Extract the predefined list of schema names
export const KernelSchemaTypes = _.values(SchemaType) as string[];

// Implementation
export class KernelMeta implements Service {
    // Source data for known schema and column names
    public readonly schemas: MapSchemas;
    public readonly columns: MapColumns;

    constructor(private readonly kernel: Kernel) {
        this.schemas = new MapSchemas(kernel);
        this.columns = new MapColumns(kernel);
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
        this.kernel.emit('kernel-meta', 'startup');

        // Instantiate
        for(let source of await this.load(SchemaType.Schema)) {
            let schema = Schema.from(source);

            // Install
            this.schemas.set(source.name, schema);
        }

        // Instantiate
        for(let source of await this.load(SchemaType.Column)) {
            let column = Column.from(source);
            let schema = this.schemas.get(column.schema_name);

            // Install
            this.columns.set(column.name, column);

            // Cross reference
            schema.insert(column);
        }
    }
    
    async cleanup(): Promise<void> {
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
        return this.kernel.knex
            .selectTo<RecordFlat>(schema_path)
            .whereNull('meta.expired_at')
            .whereNull('meta.deleted_at')
            .select();
    }
}

//
// Proxy for mapping schemas
//

export class MapSchemas extends Map<string, Schema> {
    constructor(private kernel: Kernel) {
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

        // Try to find the schema with a `kernel` prefix for known schemas
        else if (KernelSchemaTypes.includes(`system.${schema_name}`)) {
            schema = super.get(`system.${schema_name}`);
        }

        // Try to find the schema in the user's namespace
        else {
            schema = super.get(`${this.kernel.user_ns}.${schema_name}`);
        }
        
        // Moment of truth..
        if (schema === undefined) {
            throw new SchemaNotFoundError(schema_name as string);
        }

        return schema;        
    }
}

export class MapColumns extends Map<string, Column> {
    constructor(private kernel: Kernel) {
        super();
    }
}
