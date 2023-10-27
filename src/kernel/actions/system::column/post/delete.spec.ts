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

// FIXME:
test('should delete a knex column', async () => {
    let record = await kernel.data.createOne('system::column', { 
        rn: 'test.username', 
        type: 'text' 
    });

    // Make sure we can insert records
    await kernel.data.createOne('system::test', {
        rn: 'username',
        username: 'example@example.com'
    });

    // Delete column
    await kernel.data.deleteOne('system::column', record);
});
