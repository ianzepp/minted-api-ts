import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '../classes/column';
import { Filter } from '../classes/filter';
import { FilterJson } from '../classes/filter';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';

// Helpers
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
}
