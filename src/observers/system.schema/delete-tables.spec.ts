import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';
import { Record } from '@classes/record';

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test.skip('should delete a knex table', async () => {
    let schema_name = kernel.toTestSchemaName();
    let schema_data = await kernel.data.createOne(Kernel.Type.Schema, {
        schema_name: schema_name
    });

    // Make sure the schema was inserted
    let schema = kernel.meta.schemas.get(schema_name);

    // Make sure we can insert records
    let create = await kernel.data.createOne(schema, {});

    chai.expect(create).instanceOf(Record);
    chai.expect(create.data).property('id');
    chai.expect(create.data).property('ns');

    // Delete the schema
    let remove = await kernel.data.deleteOne(Kernel.Type.Schema, schema_data);

    chai.expect(create).instanceOf(Record);
    chai.expect(create.data).property('id');
    chai.expect(create.data).property('ns');

    // Check using direct knex
    let select = await kernel.knex.driverTo(schema_name, 'data').select()
        .then(() => { throw new Error('Test failed') })
        .catch(error => chai.expect(error.message).includes('does not exist'));
});
