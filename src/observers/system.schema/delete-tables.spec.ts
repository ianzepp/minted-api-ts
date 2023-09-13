import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { System } from '@classes/system';
import { SystemAsTest } from '@classes/system';
import { Record } from '@classes/record';

let system = new SystemAsTest();

beforeEach(async () => {
    await system.startup();
});

afterEach(async () => {
    await system.cleanup();
});

test('should delete a knex table', async () => {
    let schema_name = system.toTestSchemaName();
    let schema_data = await system.data.createOne(System.SchemaType.Schema, {
        schema_name: schema_name
    });

    // Make sure the schema was inserted
    let schema = system.meta.schemas.get(schema_name);

    // Make sure we can insert records
    let create = await system.data.createOne(schema, {});

    chai.expect(create).instanceOf(Record);
    chai.expect(create.data).property('id');
    chai.expect(create.data).property('ns');

    // Delete the schema
    let remove = await system.data.deleteOne(System.SchemaType.Schema, schema_data);

    chai.expect(create).instanceOf(Record);
    chai.expect(create.data).property('id');
    chai.expect(create.data).property('ns');

    // Check using direct knex
    let select = await system.knex.driverTo(schema_name, 'data').select()
        .then(() => { throw new Error('Test failed') })
        .catch(error => chai.expect(error.message).includes('does not exist'));
});
