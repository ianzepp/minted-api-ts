import _ from 'lodash';

// Classes
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { Schema } from '../classes/schema';

// Layouts
import { ObserverRing } from '../layouts/observer';


export default class extends Observer {
    toName(): string {
        return 'schema.test-schema-name';
    }
    
    onSchema(): string {
        return 'schema';
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

    async run(flow: ObserverFlow): Promise<void> {
        for(let record of flow.change) {
            flow.expect(record.data).property('schema_name').match(/^[a-z_0-9]+$/i);
            flow.expect(record.data).property('schema_name').not.match(/^[_0-9]/i);
            flow.expect(record.data).property('schema_name').not.includes('__');
        }
    }
}