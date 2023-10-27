import _ from 'lodash';
import chai from 'chai';

// Classes
import { Kernel } from '@kernel/classes/kernel';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test('will revert changes', async () => {
    
});

