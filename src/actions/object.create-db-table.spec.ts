import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { ObjectType } from '@typedefs/object';
import { Kernel } from '../kernels/kernel';


let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test('should create a knex table', async () => {
    let object_name = kernel.toTestName();    
    let object_data = await kernel.data.createOne(ObjectType.Object, {
        name: object_name
    });

    // Make sure the object was inserted
    let object = kernel.meta.objects.get(object_name);

    // Make sure we can insert records
    let create = await kernel.data.createOne(object, {});

    // Check using direct knex
    let select = await kernel.data.driverTo(object_name, 'data').first();

    chai.expect(select).not.empty;
    chai.expect(select).property('id');
    chai.expect(select).property('ns');
});

