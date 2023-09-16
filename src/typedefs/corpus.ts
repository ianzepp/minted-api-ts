import _ from 'lodash';

// Classes
import { Record } from '@classes/record';

/**
 * Represents the accessing features for the `Corpus` of data.
 */
export interface Access {

    /**
     * Filter by column.
     * @param columns - The columns to choose from.
     * @returns {Partial<Record>[]} Returns an array of partial records.
     */
    choose(columns: string[]): Partial<Record>[];

    /**
     * Filter by record.
     * @param functor - The function to select records.
     * @returns {Record[]} - Returns an array of records.
     */
    select(functor: (record: Record) => boolean): Record[];
}
