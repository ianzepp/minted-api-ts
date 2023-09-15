import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';
import { SchemaType } from '@typedefs/schema';


let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test.skip('should create a knex table', async () => {
    let schema_name = kernel.toTestSchemaName();    
    let schema_data = await kernel.data.createOne(SchemaType.Schema, {
        name: schema_name
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

