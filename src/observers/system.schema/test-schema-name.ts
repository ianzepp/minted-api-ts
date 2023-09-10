import _ from 'lodash';
import { expect } from 'chai';

// Classes
import { Observer } from '../../classes/observer';
import { ObserverFlow } from '../../classes/observer-flow';
import { Schema, SchemaType } from '../../classes/schema';

// Layouts
import { ObserverRing } from '../../layouts/observer';


export default class extends Observer {
    toName(): string {
        return 'schema.test-schema-name';
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

    async run(flow: ObserverFlow): Promise<void> {
        for(let record of flow.change) {
            let record_name = record.data.schema_name;

            // Name requirements
            expect(record_name, 'schema_name').a('string');
            expect(record_name, 'schema_name').includes('.');

            // Check each side
            let [namespace, name] = record.data.schema_name.split('.');

            expect(namespace, 'schema_name').match(/^[a-z_0-9]+$/i);
            expect(name, 'schema_name').match(/^[a-z_0-9]+$/i);

            expect(namespace, 'schema_name').not.match(/^[_0-9]/i);
            expect(name, 'schema_name').not.match(/^[_0-9]/i);

            expect(namespace, 'schema_name').not.includes('__');
            expect(name, 'schema_name').not.includes('__');
        }
    }
}