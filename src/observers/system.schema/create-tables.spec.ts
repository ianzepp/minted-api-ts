import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/kernel';


let kernel = new Tester();
let source_name = 'test.test_' + process.hrtime().join('_');
let source_data = { schema_name: source_name };

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test.skip('should create a knex table', async () => {
    let schema_name = kernel.toTestSchemaName();    
    let schema_data = await kernel.data.createOne(Kernel.Type.Schema, {
        schema_name: schema_name
    });

    // Make sure the schema was inserted
    let schema = kernel.meta.schemas.get(schema_name);

    // Make sure we can insert records
    let create = await kernel.data.createOne(schema, {});

    // Check using direct knex
    let select = await kernel.knex.driverTo(schema_name, 'data').first();

    chai.expect(select).not.empty;
    chai.expect(select).property('id');
    chai.expect(select).property('ns');
});

