import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/kernel';

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

