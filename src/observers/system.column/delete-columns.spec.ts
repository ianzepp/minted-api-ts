import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { SchemaType } from '@classes/schema-type';
import { Kernel } from '@classes/kernel';
import { KernelAsTest } from '@classes/kernel';
import { Schema } from '@classes/schema';

let kernel = new KernelAsTest();
let source_data = { 
    schema_name: SchemaType.Client, 
    column_name: 'something', 
    column_type: 'text' 
};

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test('should create a knex column', async () => {
    let record = await kernel.data.createOne(SchemaType.Column, source_data);

    // Make sure we can insert records
    await kernel.data.createOne(SchemaType.Client, {
        name: 'username',
        something: 'this is some type of value'
    });

    // Delete column
    let remove = await kernel.data.deleteOne(SchemaType.Column, record);

    // Check using direct knex
    let select = await kernel.knex.driverTo(SchemaType.Client).select().first();

    chai.expect(select).a('object');
    chai.expect(select).property('id').string;
    chai.expect(select).not.property('something');
});
