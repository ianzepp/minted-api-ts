import _ from 'lodash';
import chai from 'chai';

// Classes
import { Column } from '@system/classes/column';
import { Action } from '@system/classes/action';
import { Record } from '@system/classes/record';
import { Signal } from '@system/classes/signal';

// Typedefs
import { ColumnsMeta } from '@system/typedefs/column';
import { DataError } from '@system/kernels/kernel-data';
import { ActionRing } from '@system/typedefs/action';

/**
 * This action performs all the record prechecks/validations. This is done in one file
 * so that we don't have many small files doing duplicate loops over the same data.
 * 
 * @event KernelVerb.Create
 */
export default class extends Action {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return '*';
    }

    onRing(): ActionRing {
        return ActionRing.Test;
    }

    onCreate(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        for(let record of signal.change) {
            //
            // Per record
            //

            // Record should not have an ID already assigned
            this.test_data_id(signal, record);

            // Record should either not have a namespace, or the namespace should match the user.
            this.test_data_ns(signal, record);

            //
            // Per record, per Column
            //

            for(let column of _.values(signal.object.columns)) {
                // Columns marked as `required=true` must have a value set
                this.test_data_required(signal, record, column);

                // Columns marked as `minimum`, if set, must have a value greater-or-equal to the value
                this.test_data_minimum(signal, record, column);

                // Columns marked as `maximum`, if set, must have a value less-than-or-equal to the value
                this.test_data_maximum(signal, record, column);
            }
        }
    }

    //
    // Test functions
    //

    test_data_id(signal: Signal, record: Record) {
        if (record.data.id === null) {
            return;
        }

        if (signal.kernel.isRoot() === true) {
            return;
        }

        chai.assert.fail(`E_ID_EXISTS: A record should not have an ID when being created: found '${ record.data.id }'.`);
    }

    test_data_ns(signal: Signal, record: Record) {
        if (record.data.ns === null) {
            return;
        }

        if (record.data.ns === signal.kernel.user_ns) {
            return;
        }

        if (signal.kernel.isRoot() === true) {
            return;
        }

        chai.assert.fail(`E_NS_EXISTS: On create: a record should not have an namespace. Found '${ record.data.ns }'.`);
    }

    test_data_required(signal: Signal, record: Record, column: Column) {
        if (column.of(Column.Form.Required) === false) {
            return;
        }

        let data = record.get(column) ?? null;

        if (data !== null) {
            return;
        }

        chai.assert.fail(`E_DATA_REQUIRED: A record of type '${ column.object_name }' requires a value in '${ column.column_name }'`);
    }

    test_data_minimum(signal: Signal, record: Record, column: Column) {
        if (column.minimum === null) {
            return;
        }

        let data = record.get(column);

        if (data === null) {
            return;
        }

        if (data >= column.minimum) {
            return;
        }

        chai.assert.fail(`On create: a record of type '${ column.object_name}' with a value in '${ column.column_name }' must have a value greater-or-equal to '${ column.minimum }'`);
    }

    test_data_maximum(signal: Signal, record: Record, column: Column) {
        if (column.maximum === null) {
            return;
        }

        let data = record.get(column);

        if (data === null) {
            return;
        }

        if (data <= column.maximum) {
            return;
        }

        chai.assert.fail(`On create: a record of type '${ column.object_name}' with a value in '${ column.column_name }' must have a value less-or-equal to '${ column.maximum }'`);
    }
}
