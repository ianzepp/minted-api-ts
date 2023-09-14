import _ from 'lodash';
import chai from 'chai';

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test('runs', async () => {

});

