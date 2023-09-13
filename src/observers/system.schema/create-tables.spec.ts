import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { System } from '@classes/kernel';
import { SystemAsTest } from '@classes/kernel';

let system = new SystemAsTest();
let source_name = 'test.test_' + process.hrtime().join('_');
let source_data = { schema_name: source_name };

beforeEach(async () => {
    await system.startup();
});

afterEach(async () => {
    await system.cleanup();
});

test.skip('should create a knex table', async () => {
    let schema_name = system.toTestSchemaName();    
    let schema_data = await system.data.createOne(System.SchemaType.Schema, {
        schema_name: schema_name
    });

    // Make sure the schema was inserted
    let schema = system.meta.schemas.get(schema_name);

    // Make sure we can insert records
    let create = await system.data.createOne(schema, {});

    // Check using direct knex
    let select = await system.knex.driverTo(schema_name, 'data').first();

    chai.expect(select).not.empty;
    chai.expect(select).property('id');
    chai.expect(select).property('ns');
});

