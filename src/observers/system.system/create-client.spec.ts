import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { System } from '@classes/kernel';
import { SystemAsTest } from '@classes/kernel';
import { SystemAsRoot } from '@classes/kernel';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";
import { SchemaType } from '@classes/schema-type';

let system = new SystemAsTest();

beforeEach(async () => {
    await system.startup();
    await system.sudoRoot();
});

afterEach(async () => {
    await system.sudoExit();
    await system.cleanup();
});

test('auto-creates a new `system.client` admin user', async () => {
    let test_ns = system.toTestName();

    // Create the new system & namespace
    await system.data.createOne(SchemaType.System, { ns: test_ns, description: test_ns });

    // Assert the system exists in the right namespace
    await system.data
        .search404(SchemaType.System, { where: { ns: test_ns }})
        .catch(error => chai.assert.fail('System record not found.'));

    // Assert the client exists in the right namespace
    await system.data
        .search404(SchemaType.Client, { where: { ns: test_ns, name: 'admin' }})
        .catch(error => chai.assert.fail('Client record not found.'));
});

