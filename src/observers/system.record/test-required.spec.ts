import _ from 'lodash';
import chai from 'chai';

// Classes
import { SystemAsTest } from '../../classes/system';
import { RecordColumnRequiredError } from '../../classes/system-data';

describe(__filename, () => {
    let system = new SystemAsTest();
    let schema_name = 'test_' + process.hrtime().join('_');
    let column_name = 'test_column';

    beforeAll(async () => {
        await system.authenticate();
        await system.startup();
    });

    afterAll(async () => {
        await system.cleanup();
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

        // Should be able to create a record with all data
        let record = await system.data.createOne(schema_name, { test_column: 'some value' });

        // Should not be able to create a record without the value
        await system.data.createOne(schema_name, {})
            .then(() => chai.assert.fail('Should not be able to create a record without the value'))
            .catch(error => chai.expect(error).instanceOf(RecordColumnRequiredError));

        // // Should not be able to update back to a null value
        await system.data.updateOne(schema_name, { id: record.data.id, test_column: null })
            .then(() => chai.assert.fail('Should not be able to update back to a null value'))
            .catch(error => chai.expect(error).instanceOf(RecordColumnRequiredError));
    });
});