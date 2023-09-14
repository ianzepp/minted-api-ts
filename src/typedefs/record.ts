import _ from 'lodash';

// Typedefs
import { SchemaName } from './schema';


//
// Types
//

/** Defines the allowable types for database change operations. */
export type ChangeData = RecordFlat | RecordData | RecordJson;

/** Defines the types allowed for date-related fields. */
export type Datetime = Date | string | null;

/** ... */
export type UUID = string;


//
// Interfaces
//

/** Represents the flat JSON data of a Record. */
export interface RecordFlat extends _.Dictionary<any> {}

/** Represents the data of a record. */
export interface RecordData extends _.Dictionary<any> {
    id: string | null;
    ns: string | null;
}

/** Represents the metadata of the record. */
export interface RecordMeta {
    /** Timestamp when the record was created. */
    created_at: Date | null;

    /** User ID that created the record. */
    created_by: UUID;

    /** Timestamp when the record was updated. */
    updated_at: Datetime;

    /** User ID that created the record, or the last User ID to update the record. */
    updated_by: UUID;

    /** Timestamp when the record was expired. */
    expired_at: Datetime;

    /** User ID that expired the record, or `null` if the record was not expired. */
    expired_by: UUID | null;

    /** Timestamp when the record was deleted, or `null` if the record was not deleted */
    deleted_at: Datetime;

    /** User ID that deleted the record, or `null` if the record was not deleted */
    deleted_by: UUID | null;
}

/** Represents the access rights of various users of the record. */
export interface RecordAcls {
    /** The User IDs with full access. */
    acls_full: UUID[];

    /** The User IDs with edit access. */
    acls_edit: UUID[];

    /** The User IDs with read access. */
    acls_read: UUID[];

    /** The User IDs denied access. */
    acls_deny: UUID[];
}

/** Represents the record's JSON representation in object format. */
export interface RecordJson {
    /** Returns the string name of the parent schema type. */
    type: SchemaName;

    /** Accessor to the key/value mapping of record properties with their values. */
    data: RecordData;

    /** Accessor to the set of timestamp and access information describing this record. */
    meta: RecordMeta | null;
}

/** Represents the architecture needed to obtain a record's info. */
export interface RecordInfo extends RecordJson {
    /** Accessor to the previous version of the data (if any). */
    prev: Readonly<RecordData>;

    /** Accessor to the subset of changed data for this record for this operation. */
    diff: Readonly<Partial<RecordData>>;

    /** Accessor to the flat version of the data, with all namespaces prefixed. */
    flat: RecordFlat;

    /** Returns the set of record property keys (fully qualified). */
    keys: string[];

    /** Returns a JSON representation of this record. */
    toJSON(): Readonly<RecordJson>;

    /** Returns the full flattened record data. */
    toFlat(): Readonly<RecordFlat>;

    /** Returns the full flattened record data, but only for changed properties. */
    toFlatDiff(): Readonly<Partial<RecordFlat>>;

    /** Start an expectation. */
    expect(path?: string): Chai.Assertion;

    /** Import the original database data. */
    initialize(flat?: Readonly<RecordFlat>): void;
}
