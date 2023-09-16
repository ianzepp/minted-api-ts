import _ from 'lodash';

// Classes
import { Column } from '@classes/column';
import { Record } from '@classes/record';
import { Schema } from '@classes/schema';

// Typedefs
import { Access } from '@typedefs/corpus';
import { ColumnName } from '@typedefs/column';
import { ColumnForm } from '@typedefs/column';
import { ColumnType } from '@typedefs/column';
import { SchemaName } from '@typedefs/schema';


/**
 * The Corpus class implements the Access interface.
 * It represents a collection of records that share a common schema.
 */
export class Corpus implements Access {
    constructor(
        public readonly schema: Schema,
        public readonly records: Record[]) {}

    //
    // Getters/Setters
    //

    /**
     * Retrieves the root schema name.
     * 
     * @returns {SchemaName} Returns the schema name.
     */
    get root(): SchemaName {
        return this.schema.name;
    }

    /**
     * Retrieves the columns of the schema.
     * 
     * @returns {_.Dictionary<Column>} Returns the schema columns.
     */
    get columns(): _.Dictionary<Column> {
        return this.schema.columns;
    }

    /**
     * Retrieves the names of the schema.
     * 
     * @returns {ColumnName[]} Returns an array of schema names.
     */
    get names(): ColumnName[] {
        return this.schema.names;
    }

    /**
     * Retrieves the types of the schema.
     * 
     * @returns {ColumnType[]} Returns an array of schema types.
     */
    get types(): ColumnType[] {
        return this.schema.types;
    }

    /**
     * Retrieves the forms of the schema.
     * 
     * @returns {ColumnForm[][]} Returns an array of schema forms.
     */
    get forms(): ColumnForm[][] {
        return this.schema.forms;
    }

    //
    // Access
    //

    choose(columns: string[]): Partial<Record>[] {
        return this.records.map(record => _.pick(record, columns));
    }

    select(functor: (record: Record) => boolean): Record[] {
        return _.filter(this.records, functor);
    }
}