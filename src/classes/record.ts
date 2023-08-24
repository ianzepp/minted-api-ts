import _ from 'lodash';
import Chai from 'chai';

// Record Data Proxies
import { RecordProxyData } from '../classes/record-proxy-data';
import { RecordProxyPrev } from '../classes/record-proxy-prev';
import { RecordProxyDiff } from '../classes/record-proxy-diff';
import { RecordProxyAcls } from '../classes/record-proxy-acls';
import { RecordProxyMeta } from '../classes/record-proxy-meta';

// Classes
import { Schema } from '../classes/schema';

// Types & Interfaces
export type RecordData = _.Dictionary<any>;
export type RecordFlat = _.Dictionary<any>;
export type UUID = string;

export interface RecordMeta {
    /** Timestamp when the record was created */
    created_at: Date | null;

    /** User ID that created the record */
    created_by: UUID;

    /** Timestamp when the record was updated */
    updated_at: Date | null;

    /** User ID who created the record */
    updated_by: UUID;

    /** Timestamp when the record was trashed, or `null` if the record is not trashed */
    trashed_at: Date | null;

    /** User ID that trashed the record, or `null` if the record is not trashed */
    trashed_by: UUID | null;
}

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

export interface RecordJson {
    /** Returns the string name of the parent schema type */
    type: string;

    /** Accessor to the key/value mapping of record properties with their values */
    data: RecordData;
}

export interface RecordConcreteJson extends RecordJson {
    /** Accessor to the set of timestamp and access information describing this record */
    meta: RecordMeta;

    /** Accessor to the set of access control list data */
    acls: RecordAcls;
}

// Type sugar for proxy stuff
export function isRecordConcreteJson(something: any) {
    let pass = typeof something === 'object'
            && typeof something.acls === 'object'
            && typeof something.data === 'object'
            && typeof something.meta === 'object'
            && typeof something.type === 'string';

    return pass;
}

export function isRecordFlat(something: any) {
    let pass = typeof something === 'object'
            && typeof something.id === 'string'
            && typeof something.ns === 'string'
            && typeof something.meta__created_by === 'string'
            && typeof something.meta__updated_by === 'string';

    return pass;
}

export class Record implements RecordConcreteJson {
    // Internals
    private readonly _source_data: RecordFlat = {};
    private readonly _source_prev: RecordFlat = {
        id: null,
        ns: null,
        sc: null,
        meta__created_at: null,
        meta__created_by: null,
        meta__updated_at: null,
        meta__updated_by: null,
    };

    // Core record data proxies
    readonly data = new RecordProxyData(this);
    readonly prev = new RecordProxyPrev(this);
    readonly diff = new RecordProxyDiff(this);

    // Metadata and controls
    readonly meta = new RecordProxyMeta(this);
    readonly acls = new RecordProxyAcls(this);

    // Schema type
    readonly type: string;

    // Related objects
    constructor(readonly schema: Schema, source?: Record | RecordConcreteJson | RecordFlat | RecordData) {
        this.type = schema.name;

        // Import from record
        if (source instanceof Record) {
            this._source_data = source._source_data; // Record->Record copies are shallow
            this._source_prev = source._source_prev;
        }

        else if (isRecordConcreteJson(source)) {
            _.assign(this.data, (<RecordConcreteJson>source).data);
            _.assign(this.meta, (<RecordConcreteJson>source).meta);
            _.assign(this.acls, (<RecordConcreteJson>source).acls);

            // In order to correctly handle `diff` checks, replace previous source data
            this._source_prev = _.assign({}, this._source_data);
        }

        else if (_.isPlainObject(source)) {
            _.assign(this.data, source);
        }

        else {
            throw "Invalid record source data";
        }
    }

    get keys(): string[] {
        return _.keys(this._source_data);
    }

    toString() {
        return `${this.schema.name}#${this._source_data.id}`;
    }

    toJSON() {
        return JSON.parse(JSON.stringify({
            type: this.type,
            data: this.data,
            meta: this.meta,
            acls: this.acls,
        }));
    }

    toFlat() {
        return _.assign({}, this._source_prev, this._source_data);
    }

    toFlatDiff() {
        return this.toFlat() // TODO implementation
    }

    expect(path?: string) {
        if (path === undefined) {
            return Chai.expect(this);
        }

        else {
            return Chai.expect(this).nested.property(path);
        }
    }

    initialize(flat?: Readonly<RecordFlat>) {
        _.assign(this._source_prev, flat);
    }

    //
    // HACK - accessors for external proxies
    //

    get __source_data() {
        return this._source_data;
    }

    get __source_prev() {
        return this._source_prev;
    }
}