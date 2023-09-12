import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '@classes/column';
import { Record } from '@classes/record';

// Layouts
import { RecordData } from '@layouts/record';
import { RecordFlat } from '@layouts/record';
import { RecordJson } from '@layouts/record';

// Helpers
import { toJSON } from '@classes/helpers';

export class Schema {
    // Public helpers
    public readonly columns: Map<string, Column> = new Map();

    constructor(private readonly source: _.Dictionary<any>) {
        chai.expect(source).property('id').a('string');
        chai.expect(source).property('ns').a('string');
        chai.expect(source).property('schema_name').a('string');
    }

    get id(): string {
        return this.source.id;
    }

    get ns(): string {
        return this.source.ns;
    }

    get schema_name(): string {
        return this.source.schema_name;
    }

    get schema_type(): string {
        return this.source.schema_type ?? 'database';
    }

    get metadata(): boolean {
        return this.source.metadata ?? false;
    }
    
    toJSON() {
        return toJSON(this.source);
    }

    toRecord(source?: Record | RecordData | RecordFlat | RecordJson | _.Dictionary<any>) {
        let record = new Record(this);

        if (source === undefined) {
            // do nothing
        }

        else if (source instanceof Record) {
            _.assign(record.data, source.data);
            _.assign(record.prev, source.prev);
            _.assign(record.meta, source.meta);
        }

        else if (this.isRecordJson(source)) {
            _.assign(record.data, source.data);
            _.assign(record.meta, source.meta);
        }

        else if (this.isRecordFlat(source)) {
            _.assign(record.data, _.omit(source, Record.ColumnsInfo, Record.ColumnsAcls));
            _.assign(record.meta, _.pick(source, Record.ColumnsInfo));
        }

        else if (this.isRecordDict(source)) {
            _.assign(record.data, _.omit(source, Record.ColumnsInfo, Record.ColumnsAcls));
        }

        else {
            throw new Error('Unsupported "Record" source: ' + toJSON(source));
        }

        return record;
    }

    isRecordDict(source: unknown) {
        return typeof source === 'object'; 
    }

    isRecordFlat(source: unknown) {
        return typeof source === 'object'
            && _.has(source, 'id')
            && _.has(source, 'ns')
            && _.has(source, 'created_at')
            && _.has(source, 'updated_at')
            && _.has(source, 'expired_at')
            && _.has(source, 'acls_full')
            && _.has(source, 'acls_edit')
            && _.has(source, 'acls_read')
            && _.has(source, 'acls_deny');
    }

    isRecordJson(source: unknown) {
        return typeof source === 'object'
            && _.has(source, 'data')
            && _.has(source, 'info')
            && _.has(source, 'acls');
    }
}
