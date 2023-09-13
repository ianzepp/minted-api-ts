import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { System } from '@classes/system';
import { SystemAsTest } from '@classes/system';
import { SystemAsRoot } from '@classes/system';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

let system = new SystemAsTest();

beforeEach(async () => {
    await system.startup();
});

afterEach(async () => {
    await system.cleanup();
});

test('runs', async () => {

});

