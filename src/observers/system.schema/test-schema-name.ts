import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Thread } from '@classes/thread';

// Typedefs
import { ObserverRing } from '@typedefs/observer';
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

    async run(thread: Thread): Promise<void> {
        for(let record of thread.change) {
            thread.expect(record.data).property('schema_name').includes('.');

            let schema_name = record.data.schema_name;
            let [ns, sn] = schema_name.split('.');

            thread.expect(ns, `schema_name '${schema_name}' (left side '${ns}')`).match(/^[a-z_0-9]+$/i);
            thread.expect(ns, `schema_name '${schema_name}' (left side '${ns}')`).not.match(/^[_0-9]/i);
            thread.expect(ns, `schema_name '${schema_name}' (left side '${ns}')`).not.includes('__');

            thread.expect(sn, `schema_name '${schema_name}' (right side '${ns}')`).match(/^[a-z_0-9]+$/i);
            thread.expect(sn, `schema_name '${schema_name}' (right side '${ns}')`).not.match(/^[_0-9]/i);
            thread.expect(sn, `schema_name '${schema_name}' (right side '${ns}')`).not.includes('__');
        }
    }
}