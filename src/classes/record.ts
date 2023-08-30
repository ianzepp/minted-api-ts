import _ from 'lodash';
import chai from 'chai';

// Classes
import { Schema } from '../classes/schema';

// Helpers
import toJSON from '../helpers/toJSON';

// Types & Interfaces
export type UUID = string;

// Type sugar for proxy stuff
export function isRecordJson(schema_name: string, something: any) {
    let pass = typeof something === 'object'
            && typeof something.data === 'object'
            && typeof something.type === 'string'
            && something.type === schema_name;

    return pass;
}

export function isRecordFlat(something: any) {
    let pass = typeof something === 'object'
            && typeof something.id === 'string';

    return pass;
}

export interface RecordFlat extends _.Dictionary<any> {}

export interface RecordJson {
    type: string;
    data: RecordData;
    info: RecordInfo;
    acls: RecordAcls;
}

export interface RecordData extends _.Dictionary<any> {
    id: string | null;
    ns: string | null;
    sc: string | null;
}

export interface RecordInfo {
    created_at: string | null;
    created_by: string | null;
    updated_at: string | null;
    updated_by: string | null;
    expired_at: string | null;
    expired_by: string | null;
    trashed_at: string | null;
    trashed_by: string | null;
    deleted_at: string | null;
    deleted_by: string | null;
}

export interface RecordAcls {
    /** List of security IDs that have unrestricted access to this record */
    acls_full: UUID[];

    /** List of security IDs that can make record data changes */
    acls_edit: UUID[];

    /** List of security IDs that can explicitly read record data */
    acls_read: UUID[];

    /** List of security IDs that are explicitly blacklisted from even knowing the record exists */
    acls_deny: UUID[];
}

export class Record implements RecordJson {
    public static ColumnsInfo = [
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'expired_at',
        'expired_by',
        'trashed_at',
        'trashed_by',
        'deleted_at',
        'deleted_by',
    ];
    
    public static ColumnsAcls = [
        'acls_full',
        'acls_edit',
        'acls_read',
        'acls_deny',
    ];
    
    public readonly type: string;
    
    public readonly data: RecordData = {
        id: null,
        ns: null,
        sc: null,
    };

    public readonly prev: RecordData = {
        id: null,
        ns: null,
        sc: null,
    };
    
    public readonly info: RecordInfo = {
        created_at: null,
        created_by: null,
        updated_at: null,
        updated_by: null,
        expired_at: null,
        expired_by: null,
        trashed_at: null,
        trashed_by: null,
        deleted_at: null,
        deleted_by: null,
    };

    public readonly acls: RecordAcls = {
        acls_full: null,
        acls_edit: null,
        acls_read: null,
        acls_deny: null,
    };

    // Related objects
    constructor(readonly schema_name: string) {}

    get diff(): Partial<RecordData> {
        // diff = the accumulated difference between objects
        // k = the column name / key value
        // dv = the value of the column in the `.data` property
        // pv = the value of the column in the `.prev` property
        //
        // Note: the returned object will always contain the `id` value

        return _.transform(this.data, (diff, dv, k) => {
            let pv = this.prev[k];

            // No change in value or type
            if (pv === dv) {
                return diff;
            }

            return _.set(diff, k, dv);
        }, { id: this.data.id } as Partial<RecordData>);
    }


    // Used when importing from API-submitted http requests (partial representation with `.data` values only)
    fromRecordData(source: RecordData) {
        _.assign(this.data, source);
        return this;
    }

    // Used when importing from API-submitted http requests
    fromRecordJson(source: Partial<RecordJson>) {
        _.assign(this.data, source.data);
        _.assign(this.info, source.info);
        _.assign(this.acls, source.acls);
        return this;
    }

    // Used for a internal record-to-record copy
    fromRecord(source: Record) {
        _.assign(this.data, source.data);
        _.assign(this.prev, source.prev);
        _.assign(this.info, source.info);
        _.assign(this.acls, source.acls);
        return this;
    }

    // Used when converting from a flat knex data structure to a proper Record
    fromRecordFlat(source: RecordFlat) {
        _.assign(this.data, _.omit(source, Record.ColumnsInfo, Record.ColumnsAcls, ['id_table', 'record_id']));
        _.assign(this.info, _.pick(source, Record.ColumnsInfo));
        _.assign(this.acls, _.pick(source, Record.ColumnsAcls));
        return this;
    }

    toString() {
        return `${this.schema_name}#${this.data.id}`;
    }

    toJSON() {
        return toJSON<RecordJson>({
            type: this.type,
            data: this.data,
            info: this.info,
            acls: this.acls,
        });
    }

    expect(path?: string) {
        if (path === undefined) {
            return chai.expect(this);
        }

        else {
            return chai.expect(this).nested.property(path);
        }
    }
}