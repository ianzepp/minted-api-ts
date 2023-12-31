import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Tester } from '@system/classes/tester';

// Typedefs
import { ObjectType } from '@system/classes/object';

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

// FIXME:
test('should create a knex column', async () => {
    await kernel.data.createOne(ObjectType.Column, { 
        name: 'test.username', 
        type: 'text' 
    });

    // Make sure we can insert records
    await kernel.data.createOne(ObjectType.Test, {
        name: 'username',
        username: 'example@example.com'
    });
});

