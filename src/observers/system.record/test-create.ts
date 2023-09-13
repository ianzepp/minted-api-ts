import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Classes
import { Observer } from '@classes/observer';
import { ObserverFlow } from '@classes/observer-flow';
import { ColumnsMeta, Record } from '@classes/record';

// Layouts
import { ObserverRing } from '@layouts/observer';
import { DataError } from '@classes/kernel-data';
import { Column } from '@classes/column';

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

    async run(flow: ObserverFlow): Promise<void> {
        for(let record of flow.change) {
            //
            // Per record
            //

            // Record should not have an ID already assigned
            // Exceptions: isRoot()
            this.test_data_id(flow, record);

            // Record should either not have a namespace, or the namespace should match the user.
            // Exceptions: isRoot()
            this.test_data_ns(flow, record);

            //
            // Per record, per Column
            //

            for(let column_name of flow.schema.column_keys()) {
                let column = flow.schema.columns.get(column_name);
                
                // Columns marked as `required=true` must have a value set
                this.test_data_required(flow, record, column);

                // Columns marked as `minimum`, if set, must have a value greater-or-equal to the value
                this.test_data_minimum(flow, record, column);

                // Columns marked as `maximum`, if set, must have a value less-than-or-equal to the value
                this.test_data_maximum(flow, record, column);
            }
        }
    }

    //
    // Test functions
    //

    test_data_id(flow: ObserverFlow, record: Record) {
        if (record.data.id === null) {
            return;
        }

        if (flow.kernel.isRoot()) {
            return;
        }

        flow.failures.push(`E_ID_EXISTS: A record should not have an ID when being created: found '${ record.data.id }'.`);
    }

    test_data_ns(flow: ObserverFlow, record: Record) {
        if (record.data.ns === null) {
            return;
        }

        if (record.data.ns === flow.kernel.user_ns) {
            return;
        }

        if (flow.kernel.isRoot()) {
            return;
        }

        flow.failures.push(`E_NS_EXISTS: On create: a record should not have an namespace. Found '${ record.data.ns }'.`);
    }

    test_data_required(flow: ObserverFlow, record: Record, column: Column) {
        if (column.required === false) {
            return;
        }

        let data = record.get(column);

        if (data !== null) {
            return;
        }

        flow.failures.push(`E_DATA_REQUIRED: A record of type '${ column.schema_name}' requires a value in '${ column.column_name }`);
    }

    test_data_minimum(flow: ObserverFlow, record: Record, column: Column) {
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

        flow.failures.push(`On create: a record of type '${ column.schema_name}' with a value in '${ column.column_name }' must have a value greater-or-equal to '${ column.minimum }`);
    }

    test_data_maximum(flow: ObserverFlow, record: Record, column: Column) {
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

        flow.failures.push(`On create: a record of type '${ column.schema_name}' with a value in '${ column.column_name }' must have a value less-or-equal to '${ column.maximum }`);
    }
}
