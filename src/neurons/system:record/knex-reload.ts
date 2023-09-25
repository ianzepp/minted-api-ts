import _ from 'lodash';

// Classes
import { Neuron } from '@classes/neuron';
import { Signal } from '@classes/signal';

// Typedefs
import { NeuronRing } from '@typedefs/neuron';
import { RecordFlat } from '@typedefs/record';

/**
 * This neuron runs onUpdate() to reload prior data from the DB, so the `Record` has a full view of
 * all previous state.
 */
export default class extends Neuron {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return '*';
    }

    onRing(): NeuronRing {
        return NeuronRing.Init;
    }

    onUpdate(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        // Easiest to use the existing data service to reselect record data
        let result = await signal.kernel.data.selectAll(signal.schema, signal.change);
        let result_map = _.keyBy(result, 'data.id');

        // Assign the raw knex data for previous values to the records
        for(let record of signal.change) {
            let record_prev = result_map[record.data.id];

            if (record_prev === undefined) {
                continue; // TODO Is this an error? We have an ID but no record found?
            }

            _.assign(record.prev, record_prev.data);
            _.assign(record.meta, record_prev.meta);
        }
    }
}