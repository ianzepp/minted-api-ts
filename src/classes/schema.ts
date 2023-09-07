import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '../classes/column';
import { Filter } from '../classes/filter';
import { FilterJson } from '../classes/filter';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';
import { RecordFlat } from '../classes/record';
import { RecordData } from '../classes/record';

// Helpers
import isRecordDict from '../helpers/isRecordDict';
import isRecordFlat from '../helpers/isRecordFlat';
import isRecordJson from '../helpers/isRecordJson';
import toJSON from '../helpers/toJSON';

export class Schema {
    // Public helpers
    public readonly system_name: string;
    public readonly columns: _.Dictionary<Column> = {};

    constructor(private readonly source: _.Dictionary<any>) {
        chai.expect(source).property('id').a('string');
        chai.expect(source).property('ns').a('string');
        chai.expect(source).property('schema_name').a('string');
        chai.expect(source).property('schema_type').a('string');
        chai.expect(source).property('metadata').a('boolean');

        // Set system name
        this.system_name = `${ source.ns }__${ source.schema_name }`;
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
        return this.source.schema_type;
    }

    get metadata(): boolean {
        return this.source.metadata;
    }
    
    toJSON() {
        return toJSON(this.source);
    }

    toRecord(source?: Record | RecordJson | RecordFlat | RecordData | _.Dictionary<any>) {
        let record = new Record(this);

        if (source === undefined) {
            // do nothing
        }

        else if (source instanceof Record) {
            _.assign(record.data, source.data);
            _.assign(record.prev, source.prev);
            _.assign(record.info, source.info);
            _.assign(record.acls, source.acls);
        }

        else if (isRecordJson(source)) {
            _.assign(record.data, source.data);
            _.assign(record.info, source.info);
            _.assign(record.acls, source.acls);
        }

        else if (isRecordFlat(source)) {
            _.assign(record.data, _.omit(source, Record.ColumnsInfo, Record.ColumnsAcls));
            _.assign(record.info, _.pick(source, Record.ColumnsInfo));
            _.assign(record.acls, _.pick(source, Record.ColumnsAcls));
        }

        else if (isRecordDict(source)) {
            _.assign(record.data, _.omit(source, Record.ColumnsInfo, Record.ColumnsAcls));
        }

        else {
            throw new Error('Unsupported "Record" source: ' + toJSON(source));
        }

        return record;
    }
}
