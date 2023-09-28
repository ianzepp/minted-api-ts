import _ from 'lodash';

// Classes
import { Column } from '@classes/column';
import { Record } from '@classes/record';
import { Object } from '@classes/object';

// Typedefs
import { Access } from '@typedefs/corpus';
import { ColumnName } from '@typedefs/column';
import { ColumnForm } from '@typedefs/column';
import { ColumnType } from '@typedefs/column';
import { ObjectName } from '@typedefs/object';


/**
 * The Corpus class implements the Access interface.
 * It represents a collection of records that share a common object.
 */
export class Corpus implements Access {
    constructor(
        public readonly object: Object,
        public readonly records: Record[]) {}

    //
    // Getters/Setters
    //

    /**
     * Retrieves the root object name.
     * 
     * @returns {ObjectName} Returns the object name.
     */
    get root(): ObjectName {
        return this.object.name;
    }

    /**
     * Retrieves the columns of the object.
     * 
     * @returns {_.Dictionary<Column>} Returns the object columns.
     */
    get columns(): _.Dictionary<Column> {
        return this.object.columns;
    }

    /**
     * Retrieves the names of the object.
     * 
     * @returns {ColumnName[]} Returns an array of object names.
     */
    get names(): ColumnName[] {
        return this.object.names;
    }

    /**
     * Retrieves the types of the object.
     * 
     * @returns {ColumnType[]} Returns an array of object types.
     */
    get types(): ColumnType[] {
        return this.object.types;
    }

    /**
     * Retrieves the forms of the object.
     * 
     * @returns {ColumnForm[][]} Returns an array of object forms.
     */
    get forms(): ColumnForm[][] {
        return this.object.forms;
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