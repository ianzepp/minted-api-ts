import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { System } from '../../classes/system';
import { SystemAsTest } from '../../classes/system';

let system = new SystemAsTest();
let source_name = 'test.test_' + process.hrtime().join('_');
let source_data = { schema_name: source_name };

beforeEach(async () => {
    await system.startup();
});

afterEach(async () => {
    await system.cleanup();
});

test('should delete a knex table', async () => {
    let record = await system.data.createOne(System.SchemaType.Schema, source_data);

    // Make sure we can insert records
    await system.data.createOne(source_name, {});

    // Delete the schema
    let remove = await system.data.deleteOne(System.SchemaType.Schema, record);

    // Check using direct knex
    let select = await system.knex.driverTo(source_name, 'data').select()
        .then(() => { throw new Error('Test failed') })
        .catch(error => chai.expect(error.message).includes('does not exist'));
});

