import _ from 'lodash';

// Classes
import { Neuron } from '@classes/neuron';
import { Signal } from '@classes/signal';

// Typedefs
import { NeuronRing } from '@typedefs/neuron';
import { ObjectType } from '@typedefs/object';


export default class extends Neuron {
    toName(): string {
        return __filename;
    }
    
    onObject(): string {
        return ObjectType.Object;
    }

    onRing(): NeuronRing {
        return NeuronRing.Test;
    }

    onCreate(): boolean {
        return true;
    }

    onUpdate(): boolean {
        return true;
    }

    onUpsert(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        for(let record of signal.change) {
            signal.expect(record.data).property('name').includes(':');

            let object_name = record.data.name;
            let [ns, sn] = object_name.split(':');

            signal.expect(ns, `object_name '${object_name}' (left side '${ns}')`).match(/^[a-z_0-9]+$/i);
            signal.expect(ns, `object_name '${object_name}' (left side '${ns}')`).not.match(/^[_0-9]/i);
            signal.expect(ns, `object_name '${object_name}' (left side '${ns}')`).not.includes('__');

            signal.expect(sn, `object_name '${object_name}' (right side '${ns}')`).match(/^[a-z_0-9]+$/i);
            signal.expect(sn, `object_name '${object_name}' (right side '${ns}')`).not.match(/^[_0-9]/i);
            signal.expect(sn, `object_name '${object_name}' (right side '${ns}')`).not.includes('__');
        }
    }
}