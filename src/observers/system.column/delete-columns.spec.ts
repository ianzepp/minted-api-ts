import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';
import { Schema } from '@classes/schema';

// Typedefs
import { SchemaType } from '@typedefs/schema';

let kernel = new Tester();
let source_data = { 
    schema_name: SchemaType.User, 
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
    await kernel.data.createOne(SchemaType.User, {
        name: 'username',
        something: 'this is some type of value'
    });

    // Delete column
    let remove = await kernel.data.deleteOne(SchemaType.Column, record);

    // Check using direct knex
    let select = await kernel.knex.driverTo(SchemaType.User).select().first();

    chai.expect(select).a('object');
    chai.expect(select).property('id').string;
    chai.expect(select).not.property('something');
});
