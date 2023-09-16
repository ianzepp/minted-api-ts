import _ from 'lodash';

// Classes
import { Column } from '@classes/column';
import { Observer } from '@classes/observer';
import { Record } from '@classes/record';
import { Thread } from '@classes/thread';

// Typedefs
import { ColumnsMeta } from '@typedefs/column';
import { DataError } from '@classes/kernel-data';
import { ObserverRing } from '@typedefs/observer';

/**
 * This observer performs all the record prechecks/validations. This is done in one file
 * so that we don't have many small files doing duplicate loops over the same data.
 * 
 * @event KernelVerb.Create
 */
export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return '*';
    }

    onRing(): ObserverRing {
        return ObserverRing.Test;
    }

    onCreate(): boolean {
        return true;
    }

    async run(thread: Thread): Promise<void> {
        for(let record of thread.change) {
            //
            // Per record
            //

            // Record should not have an ID already assigned
            // Exceptions: isRoot()
            this.test_data_id(thread, record);

            // Record should either not have a namespace, or the namespace should match the user.
            // Exceptions: isRoot()
            this.test_data_ns(thread, record);

            //
            // Per record, per Column
            //

            for(let column of _.values(thread.schema.columns)) {
                // Columns marked as `required=true` must have a value set
                this.test_data_required(thread, record, column);

                // Columns marked as `minimum`, if set, must have a value greater-or-equal to the value
                this.test_data_minimum(thread, record, column);

                // Columns marked as `maximum`, if set, must have a value less-than-or-equal to the value
                this.test_data_maximum(thread, record, column);
            }
        }
    }

    //
    // Test functions
    //

    test_data_id(thread: Thread, record: Record) {
        if (record.data.id === null) {
            return;
        }

        if (thread.kernel.isRoot()) {
            return;
        }

        thread.failures.push(`E_ID_EXISTS: A record should not have an ID when being created: found '${ record.data.id }'.`);
    }

    test_data_ns(thread: Thread, record: Record) {
        if (record.data.ns === null) {
            return;
        }

        if (record.data.ns === thread.kernel.user_ns) {
            return;
        }

        if (thread.kernel.isRoot()) {
            return;
        }

        thread.failures.push(`E_NS_EXISTS: On create: a record should not have an namespace. Found '${ record.data.ns }'.`);
    }

    test_data_required(thread: Thread, record: Record, column: Column) {
        if (column.of(Column.Form.Required) === false) {
            return;
        }

        let data = record.get(column);

        if (data !== null) {
            return;
        }

        thread.failures.push(`E_DATA_REQUIRED: A record of type '${ column.schema_name}' requires a value in '${ column.column_name }'`);
    }

    test_data_minimum(thread: Thread, record: Record, column: Column) {
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

        thread.failures.push(`On create: a record of type '${ column.schema_name}' with a value in '${ column.column_name }' must have a value greater-or-equal to '${ column.minimum }'`);
    }

    test_data_maximum(thread: Thread, record: Record, column: Column) {
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

        thread.failures.push(`On create: a record of type '${ column.schema_name}' with a value in '${ column.column_name }' must have a value less-or-equal to '${ column.maximum }'`);
    }
}
