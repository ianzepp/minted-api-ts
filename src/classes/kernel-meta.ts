import _ from 'lodash';

// Classes
import { Filter } from '@classes/filter';
import { Object } from '@classes/object';
import { Column } from '@classes/column';
import { Record } from '@classes/record';
import { Kernel } from '@classes/kernel';
import { toJSON } from '@classes/helper';

// Typedefs
import { Service } from '@typedefs/kernel';
import { RecordFlat } from '@typedefs/record';
import { ObjectType } from '@typedefs/object';


// Meta API errors
export class MetaError extends Error {};
export class ObjectNotFoundError extends MetaError {};
export class ColumnNotFoundError extends MetaError {};

// Extract the predefined list of object names
export const KernelObjectTypes = _.values(ObjectType) as string[];

// Implementation
export class KernelMeta implements Service {
    // Source data for known object and column names
    public readonly sources: Map<string, RecordFlat[]> = new Map();
    public readonly objects: MapObjects;
    public readonly columns: MapColumns;

    constructor(private readonly kernel: Kernel) {
        this.objects = new MapObjects(kernel);
        this.columns = new MapColumns(kernel);
    }

    /**
     * The `startup` method loads all the core metadata from the DB into a local
     * service cache. At present, it does the following:
     * 
     * 1. Load all `system.object` records
     * 2. Load all `system.column` records
     * 
     * Once the data is here, we store it in the metadata cache.
     */

    async startup(): Promise<void> {
        // Instantiate
        for(let source of await this.load(ObjectType.Object)) {
            let object = Object.from(source);

            // Install
            this.objects.set(source.name, object);
        }

        // Instantiate
        for(let source of await this.load(ObjectType.Column)) {
            let column = Column.from(source);
            let object = this.objects.get(column.object_name);

            // Install
            this.columns.set(column.name, column);

            // Cross reference
            object.insert(column);
        }
    }
    
    async cleanup(): Promise<void> {
        this.sources.clear();
        this.objects.clear();
        this.columns.clear();
    }

    async refresh() {
        await this.cleanup();
        await this.startup();
    }

    async describe() {
        
    }

    //
    // Metadata source helper
    //

    async load(object_path: string) {
        let sources = await this.kernel.knex
            .selectTo<RecordFlat>(object_path)
            .whereNull('meta.expired_at')
            .whereNull('meta.deleted_at')
            .select();

        // Save the results
        this.sources.set(object_path, sources);

        // Done
        return sources;
    }
    

    find_source(object_path: string, match: string, k: string = 'name') {
        return _.find(this.sources.get(object_path), source => {
            return source[k] === match;
        });
    }
}

//
// Proxy for mapping objects
//

export class MapObjects extends Map<string, Object> {
    constructor(private kernel: Kernel) {
        super();
    }

    get(object_name: Object | string) {
        // Already a Object instance? Nothing needed..
        if (object_name instanceof Object) {
            return object_name;
        }

        // It must be at least a string
        if (typeof object_name !== 'string') {
            throw new ObjectNotFoundError(object_name as string);

        }

        // Convert the string to lower-case and clean it up
        object_name = object_name.toLowerCase().trim();

        // Try to find a fully-qualified name
        let object: Object | undefined;

        if (object_name.includes(':')) {
            object = super.get(object_name);
        }

        // Try to find the object with a `system` prefix for known objects
        else if (KernelObjectTypes.includes(`system:${object_name}`)) {
            object = super.get(`system:${object_name}`);
        }

        // Try to find the object in the user's namespace
        else {
            object = super.get(`${this.kernel.user_ns}.${object_name}`);
        }
        
        // Moment of truth..
        if (object === undefined) {
            throw new ObjectNotFoundError(object_name as string);
        }

        return object;        
    }
}

export class MapColumns extends Map<string, Column> {
    constructor(private kernel: Kernel) {
        super();
    }
}
