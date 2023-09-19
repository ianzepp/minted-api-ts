//
// Types
//

/** ... */
export type SchemaName = string;

/** ... */
// export type SchemaType = SchemaInfo | SchemaName;


//
// Enums
//

export enum SchemaType {
    Domain = 'domain',
    Schema = 'schema',
    Column = 'column',
    User = 'user',
};


//
// Interfaces
//

/** Represents the architecture needed to obtain a schema's info. */
export interface SchemaInfo {
    /** Returns the name of the schema */
    readonly name: SchemaName;

    /** Generate a new filter */
    // toFilter(source?: FilterJson): FilterInfo;

    /** Generate a new record */
    // toRecord(source?: ChangeData): RecordInfo;

    /** Generate a new collection of records */
    // toChange(source?: ChangeData[]): RecordInfo[];

    /** Proxy to `system.data.selectAll()` */
    // selectAll(filter: FilterJson): Promise<RecordInfo[]>;

    /** Proxy to `system.data.selectOne()` */
    // selectOne(filter: FilterJson): Promise<RecordInfo | undefined>;

    /** Proxy to `system.data.select404()` */
    // select404(filter: FilterJson): Promise<RecordInfo>;

    /** Proxy to `system.data.createAll()` */
    // createAll(change: ChangeData[]): Promise<RecordInfo[]>;

    /** Proxy to `system.data.createOne()` */
    // createOne(change: ChangeData): Promise<RecordInfo>;

    /** Proxy to `system.data.updateAll()` */
    // updateAll(change: ChangeData[]): Promise<RecordInfo[]>;

    /** Proxy to `system.data.updateOne()` */
    // updateOne(change: ChangeData): Promise<RecordInfo>;

    /** Proxy to `system.data.upsertAll()` */
    // upsertAll(change: ChangeData[]): Promise<RecordInfo[]>;

    /** Proxy to `system.data.upsertOne()` */
    // upsertOne(change: ChangeData): Promise<RecordInfo>;

    /** Proxy to `system.data.deleteAll()` */
    // deleteAll(change: ChangeData[]): Promise<RecordInfo[]>;

    /** Proxy to `system.data.deleteOne()` */
    // deleteOne(change: ChangeData): Promise<RecordInfo>;
}