import _ from 'lodash';
import chai from 'chai';

// Classes
import { Kernel } from '@system/kernels/kernel';
import { Tester } from '@system/classes/tester';
import { KnexDriver } from './system/classes/knex';

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
    await kernel.data.selectAny('system::object', {});
    await kernel.data.selectAny('system::object', {});
});

