import _ from 'lodash';
import chai from 'chai';

// Classes
import { Schema } from '../classes/schema';

// Types & Interfaces
export type UUID = string;

export interface RecordAcls {
    /** List of security IDs that have unrestricted access to this record */
    full: UUID[];

    /** List of security IDs that can make record data changes */
    edit: UUID[];

    /** List of security IDs that can explicitly read record data */
    read: UUID[];

    /** List of security IDs that are explicitly blacklisted from even knowing the record exists */
    deny: UUID[];
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
    deleted_at: string | null;
    deleted_by: string | null;
}

export interface RecordJson {
    type: string;
    data: Partial<RecordData>;
    info: Partial<RecordInfo>;
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
        deleted_at: null,
        deleted_by: null,
    };

    // Related objects
    constructor(readonly schema: Schema, source?: Partial<RecordJson>) {
        this.type = schema.name;
        
        if (source) {
            _.assign(this.data, source.data || {});
            _.assign(this.info, source.info || {});

        }

        // Import from record
        if (source instanceof Record) {
            _.assign(this.data, source.data);
            _.assign(this.info, source.info);
        }

        else {
            _.assign(this.data, source.data);
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
        }));
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