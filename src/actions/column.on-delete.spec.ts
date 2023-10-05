import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@classes/kernel';

// Typedefs
import { ObjectType } from '@typedefs/object';

let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

// FIXME:
test.skip('should delete a knex column', async () => {
    let record = await kernel.data.createOne(ObjectType.Column, { 
        name: ObjectType.User + ':something', 
        type: 'text' 
    });

    // Make sure we can insert records
    await kernel.data.createOne(ObjectType.User, {
        name: 'username',
        something: 'this is some type of value'
    });

    // Delete column
    let remove = await kernel.data.deleteOne(ObjectType.Column, record);

    // Check using direct knex
    let select = await kernel.data.driverTo(ObjectType.User).select().first();

    chai.expect(select).a('object');
    chai.expect(select).property('id').string;
    chai.expect(select).not.property('something');
});
