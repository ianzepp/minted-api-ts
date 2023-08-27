import _ from 'lodash';
import chai from 'chai';

// Classes
import { Schema } from '../classes/schema';

// Types & Interfaces
export type UUID = string;

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

export interface RecordData extends _.Dictionary<any> {
    id: string | null;
    ns: string | null;
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

export interface RecordJson {
    type: string;
    data: Partial<RecordData>;
    info: Partial<RecordInfo>;
    acls: Partial<RecordAcls>;
}

export class Record implements RecordJson {
    readonly type: string;

    readonly data: RecordData = {
        id: null,
        ns: null,
    };
    
    readonly info: RecordInfo = {
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

    readonly acls: RecordAcls = {
        acls_full: null,
        acls_edit: null,
        acls_read: null,
        acls_deny: null,
    };

    // Related objects
    constructor(readonly schema: Schema, source?: Partial<RecordJson>) {
        this.type = schema.name;
        
        if (source instanceof Record) {
            _.assign(this.data, source.data);
            _.assign(this.info, source.info);
            _.assign(this.acls, source.acls);
        }

        else {
            _.assign(this.data, source.data || {});
            _.assign(this.info, source.info || {});
            _.assign(this.acls, source.acls || {});
        }
    }

    get keys(): string[] {
        return _.keys(this.data);
    }

    toString() {
        return `${this.schema.name}#${this.data.id}`;
    }

    toJSON() {
        return JSON.parse(JSON.stringify({
            type: this.type,
            data: this.data,
            info: this.info,
            acls: this.acls,
        }));
    }

    toData() {
        return this.data;
    }

    toInfo() {
        return this.info;
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