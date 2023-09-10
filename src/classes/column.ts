import _ from 'lodash';
import chai from 'chai';

// Classes
import { Schema } from '../classes/schema';

// Layouts
import { ColumnType } from '../layouts/column';

// Helpers
import assertReturn from '../helpers/assertReturn';
import toJSON from '../helpers/toJSON';


export class Column {
    constructor(private readonly source: _.Dictionary<any>) {
        chai.expect(source).property('id').a('string');
        chai.expect(source).property('ns').a('string');

        chai.expect(source).property('schema_name').a('string');
        chai.expect(source).property('column_name').a('string');
        chai.expect(source).property('column_type').a('string');
        
        chai.expect(source).property('audited').a('boolean');
        chai.expect(source).property('immutable').a('boolean');
        chai.expect(source).property('indexed').a('boolean');
        chai.expect(source).property('internal').a('boolean');
        chai.expect(source).property('required').a('boolean');
        chai.expect(source).property('unique').a('boolean');
        
        chai.expect(source).property('minimum');
        chai.expect(source).property('maximum');
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

    get column_name(): string {
        return this.source.column_name;
    }

    get column_type(): string {
        return this.source.column_type;
    }

    get audited(): boolean {
        return this.source.audited;
    }

    get immutable(): boolean {
        return this.source.immutable;
    }

    get indexed(): boolean {
        return this.source.indexed;
    }

    get internal(): boolean {
        return this.source.internal;
    }

    get required(): boolean {
        return this.source.required;
    }

    get unique(): boolean {
        return this.source.unique;
    }

    get minimum(): number | null {
        return this.source.minimum;
    }

    get maximum(): number | null {
        return this.source.maximum;
    }

    toJSON() {
        return toJSON(this.source);
    }
}
