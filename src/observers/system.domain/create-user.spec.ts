import _ from 'lodash';
import chai from 'chai';

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';

// Typedefs
import { SchemaType } from '@typedefs/schema';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";


let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
    await kernel.sudoRoot();
});

afterEach(async () => {
    await kernel.sudoExit();
    await kernel.cleanup();
});

test('auto-creates a new `system.user` admin user', async () => {
    let test_ns = kernel.toTestName();

    // Create the new domain & namespace
    await kernel.data.createOne(SchemaType.Domain, { ns: test_ns, description: test_ns });

    // Assert the domain exists in the right namespace
    await kernel.data
        .search404(SchemaType.Domain, { where: { ns: test_ns }})
        .catch(error => chai.assert.fail('Domain record not found.'));

    // Assert the client exists in the right namespace
    await kernel.data
        .search404(SchemaType.User, { where: { ns: test_ns, name: 'admin' }})
        .catch(error => chai.assert.fail('User record not found.'));
});

