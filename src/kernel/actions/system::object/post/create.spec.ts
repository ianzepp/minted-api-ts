import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@kernel/classes/kernel';


let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test('should create a knex table', async () => {
    let object_name = kernel.toTestName();    
    let object_data = await kernel.data.createOne('system::object', {
        name: object_name
    });

    // Refresh the metadata
    await kernel.meta.refresh();

    // Make sure the object was inserted
    let object = kernel.meta.lookup(object_name);

    // Make sure we can insert records
    await kernel.data.createOne(object, {});
});

