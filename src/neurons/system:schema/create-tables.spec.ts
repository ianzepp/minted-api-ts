import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';
import { ObjectType } from '@typedefs/object';


let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test.skip('should create a knex table', async () => {
    let object_name = kernel.toTestObjectName();    
    let object_data = await kernel.data.createOne(ObjectType.Object, {
        name: object_name
    });

    // Make sure the object was inserted
    let object = kernel.meta.objects.get(object_name);

    // Make sure we can insert records
    let create = await kernel.data.createOne(object, {});

    // Check using direct knex
    let select = await kernel.knex.driverTo(object_name, 'data').first();

    chai.expect(select).not.empty;
    chai.expect(select).property('id');
    chai.expect(select).property('ns');
});

