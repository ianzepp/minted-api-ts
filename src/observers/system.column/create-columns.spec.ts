import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';

// Typedefs
import { SchemaType } from '@typedefs/schema';

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

// FIXME:
test.skip('should create a knex column', async () => {
    await kernel.data.createOne(SchemaType.Column, { 
        name: SchemaType.User + ':something', 
        type: 'text' 
    });

    // Make sure we can insert records
    await kernel.data.createOne(SchemaType.User, {
        name: 'username',
        something: 'this is some type of value'
    });

    // Check using direct knex
    let select = await kernel.knex.driverTo(SchemaType.User).select().first();

    chai.expect(select).a('object');
    chai.expect(select).property('id').string;
    chai.expect(select).property('something');
});

