import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Tester } from '@system/classes/tester';

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

// FIXME:
test('should create a knex column', async () => {
    await kernel.data.createOne('system::column', { 
        rn: 'test.username', 
        type: 'text' 
    });

    // Make sure we can insert records
    await kernel.data.createOne('system::test', {
        rn: 'username',
        username: 'example@example.com'
    });
});

