import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '@kernel/classes/column';
import { Action } from '@kernel/classes/action';
import { Record } from '@kernel/classes/record';
import { Signal } from '@kernel/classes/signal';

/**
 * This action performs all the record prechecks/validations. This is done in one file
 * so that we don't have many small files doing duplicate loops over the same data.
 * 
 * @event KernelVerb.Create
 */
export default class extends Action {
    constructor() {
        super(__filename, { series: true });
    }
    
    async one(signal: Signal, record: Record): Promise<void> {
        //
        // Per record, excluding root
        //

        if (signal.kernel.isRoot() === false) {
            // Record should not have an ID already assigned
            this.test_data_id(signal, record);

            // Record should either not have a namespace, or the namespace should match the user.
            this.test_data_ns(signal, record);
        }

        //
        // Per Record, per Column, including root
        //

        for(let column of _.values(signal.object.columns)) {
            // Columns marked as `required=true` must have a value set
            this.test_data_required(signal, record, column);

            // Columns marked as `minimum`, if not `null`, must have a value greater-or-equal to the value
            this.test_data_minimum(signal, record, column);

            // Columns marked as `maximum`, if not `null`, must have a value less-than-or-equal to the value
            this.test_data_maximum(signal, record, column);
        }
    }

    //
    // Test functions
    //

    test_data_id({ kernel }: Signal, record: Record) {
        record.expect('id').null;
    }

    test_data_ns({ kernel }: Signal, record: Record) {
        record.expect('ns').oneOf([null, kernel.user.ns]);
    }

    test_data_required(signal: Signal, record: Record, column: Column) {
        if (column.data.required !== true) {
            return;
        }

        record.expect(column).not.null;
    }

    test_data_minimum(signal: Signal, record: Record, column: Column) {
        if (typeof column.data.minimum !== 'number') {
            return;
        }

        if (record.get(column) === null) {
            return;
        }

        record.expect(column).greaterThanOrEqual(column.data.minimum);
    }

    test_data_maximum(signal: Signal, record: Record, column: Column) {
        if (typeof column.data.maximum !== 'number') {
            return;
        }

        if (record.get(column) === null) {
            return;
        }

        record.expect(column).lessThanOrEqual(column.data.maximum);
    }
}