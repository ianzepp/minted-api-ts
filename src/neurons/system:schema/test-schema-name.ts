import _ from 'lodash';

// Classes
import { Observer } from '@classes/neuron';
import { Signal } from '@classes/signal';

// Typedefs
import { ObserverRing } from '@typedefs/neuron';
import { SchemaType } from '@typedefs/schema';


export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return SchemaType.Schema;
    }

    onRing(): ObserverRing {
        return ObserverRing.Test;
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

            let schema_name = record.data.name;
            let [ns, sn] = schema_name.split(':');

            signal.expect(ns, `schema_name '${schema_name}' (left side '${ns}')`).match(/^[a-z_0-9]+$/i);
            signal.expect(ns, `schema_name '${schema_name}' (left side '${ns}')`).not.match(/^[_0-9]/i);
            signal.expect(ns, `schema_name '${schema_name}' (left side '${ns}')`).not.includes('__');

            signal.expect(sn, `schema_name '${schema_name}' (right side '${ns}')`).match(/^[a-z_0-9]+$/i);
            signal.expect(sn, `schema_name '${schema_name}' (right side '${ns}')`).not.match(/^[_0-9]/i);
            signal.expect(sn, `schema_name '${schema_name}' (right side '${ns}')`).not.includes('__');
        }
    }
}