import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';
import { Record } from '@classes/record';
import { ObjectType } from '@typedefs/object';

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test.skip('should delete a knex table', async () => {
    let object_name = kernel.toTestObjectName();
    let object_data = await kernel.data.createOne(ObjectType.Object, {
        name: object_name
    });

    // Make sure the object was inserted
    let object = kernel.meta.objects.get(object_name);

    // Make sure we can insert records
    let create = await kernel.data.createOne(object, {});

    chai.expect(create).instanceOf(Record);
    chai.expect(create.data).property('id');
    chai.expect(create.data).property('ns');

    // Delete the object
    let remove = await kernel.data.deleteOne(ObjectType.Object, object_data);

    chai.expect(create).instanceOf(Record);
    chai.expect(create.data).property('id');
    chai.expect(create.data).property('ns');

    // Check using direct knex
    let select = await kernel.data.driverTo(object_name, 'data').select()
        .then(() => { throw new Error('Test failed') })
        .catch(error => chai.expect(error.message).includes('does not exist'));
});
