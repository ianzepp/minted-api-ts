import _ from 'lodash';

// Classes
import { Tester } from '@system/classes/tester';

// Bun:test
import { beforeEach, afterEach, afterAll, test } from "bun:test";

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test('runs', async () => {

});

