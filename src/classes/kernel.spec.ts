import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';

let kernel = new Tester();

beforeEach(() => kernel.startup());
afterEach(() => kernel.cleanup());

test('tx test: insert a user => should rollback', async () => {
    let result = await kernel.data.createOne('system.user', { name: 'kernel-tx-test' });
    chai.expect(result).an('object').not.empty;
});

test('tx test: verify the user does not exist', async () => {
    let result = await kernel.data.selectAny('system.user', { where: { name: 'kernel-tx-test' }});
    chai.expect(result).an('array').empty;
});

