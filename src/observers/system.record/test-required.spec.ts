import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Column } from '../../classes/column';
import { Record } from '../../classes/record';
import { Schema } from '../../classes/schema';
import { System } from '../../classes/system';

describe(__filename, () => {
    let system: System;
    let schema_name = 'test_' + process.hrtime().join('_');
    let column_name = 'test_column';

    beforeAll(async () => {
        system = await new System({ id: uuid(), ns: 'test', scopes: null }).startup();
    });

    afterAll(async () => {
        return system.knex.destroy();
    });

    test('required column should throw an error', async () => {
        let schema = await system.data.createOne('schema', {
            schema_name: schema_name,
            schema_type: 'database',
        });

        let column = await system.data.createOne('column', {
            schema_name: schema_name,
            column_name: column_name,
            column_type: 'text',
            required: true
        });

        // Refresh the metadata
        await system.meta.refresh();

        // Should not be able to create a record without the value
        try {
            let tested = await system.data.createOne(schema_name, {});

            // Did not throw yet
            throw new Error('Test case failed');
        }

        catch (error) {
            chai.expect(error).property('message', '"test_column" is required');
        }

        // Should be able to create a record
        let record = await system.data.createOne(schema_name, {
            test_column: 'some value'
        });

        // Should not be able to update record back to a null value
        try {
            record.data.test_column = null;
            record = await system.data.updateOne(schema_name, record);

            // Did not throw yet
            throw new Error('Test case failed');
        }

        catch (error) {
            chai.expect(error).property('message', '"test_column" is required');
        }    
    });
});