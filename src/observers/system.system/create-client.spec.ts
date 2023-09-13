import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Kernel } from '@classes/kernel';
import { KernelAsTest } from '@classes/kernel';
import { KernelAsRoot } from '@classes/kernel';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";
import { SchemaType } from '@classes/schema-type';

let kernel = new KernelAsTest();

beforeEach(async () => {
    await kernel.startup();
    await kernel.sudoRoot();
});

afterEach(async () => {
    await kernel.sudoExit();
    await kernel.cleanup();
});

test('auto-creates a new `system.client` admin user', async () => {
    let test_ns = kernel.toTestName();

    // Create the new kernel & namespace
    await kernel.data.createOne(SchemaType.Kernel, { ns: test_ns, description: test_ns });

    // Assert the kernel exists in the right namespace
    await kernel.data
        .search404(SchemaType.Kernel, { where: { ns: test_ns }})
        .catch(error => chai.assert.fail('Kernel record not found.'));

    // Assert the client exists in the right namespace
    await kernel.data
        .search404(SchemaType.Client, { where: { ns: test_ns, name: 'admin' }})
        .catch(error => chai.assert.fail('Client record not found.'));
});

