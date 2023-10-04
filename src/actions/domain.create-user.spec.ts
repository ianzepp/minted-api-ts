import _ from 'lodash';
import chai from 'chai';

// Classes
import { Kernel } from '@classes/kernel';

// Typedefs
import { ObjectType } from '@typedefs/object';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";


let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
    await kernel.sudoRoot();
});

afterEach(async () => {
    await kernel.sudoExit();
    await kernel.cleanup();
});

test.skip('auto-creates a new `system.user` admin user', async () => {
    let test_ns = kernel.toTestName();

    // Create the new domain & namespace
    await kernel.data.createOne(ObjectType.Domain, { ns: test_ns, name: test_ns });

    // Assert the domain exists in the right namespace
    await kernel.data
        .search404(ObjectType.Domain, { where: { ns: test_ns }})
        .catch(error => chai.assert.fail('Domain record not found.'));

    // Assert the client exists in the right namespace
    await kernel.data
        .search404(ObjectType.User, { where: { ns: test_ns, name: 'admin' }})
        .catch(error => chai.assert.fail('User record not found.'));
});

