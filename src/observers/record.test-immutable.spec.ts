import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Column } from '../classes/column';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { System } from '../classes/system';

describe(__filename, () => {
    let system: System;
    let schema_name = 'test_' + new Date().getTime();
    let column_name = 'test_immutable';

    beforeAll(async () => {
        system = await new System({ id: uuid(), ns: 'test', scopes: null }).startup();
    });

    afterAll(async () => {
        return system.knex.destroy();
    });

    test('immutable column should throw an error', async () => {
        let schema = await system.data.createOne('schema', {
            schema_name: schema_name,
            schema_type: 'database',
        });

        let column = await system.data.createOne('column', {
            schema_name: schema_name,
            column_name: column_name,
            column_type: 'text',
            immutable: true
        });

        // Refresh the metadata
        await system.meta.refresh();

        // Should be able to create a record
        let record = await system.data.createOne(schema_name, {
            test_immutable: 'some value'
        });

        // Should not be able to change the value
        try {
            record.data.test_immutable = 'changed value';
            record = await system.data.updateOne(schema_name, record);

            // Did not throw yet
            throw new Error('Test case failed');
        }

        catch (error) {
            chai.expect(error).property('message', '"test_immutable" is immutable');
        }
    });
});