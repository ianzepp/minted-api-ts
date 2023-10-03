import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';
import { ObjectType } from '@typedefs/object';

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test('tx test: insert a user => should rollback', async () => {
    let result = await kernel.data.createOne(ObjectType.User, { name: 'kernel-tx-test' });
    chai.expect(result).an('object').not.empty;
});

test('tx test: verify the user does not exist', async () => {
    let result = await kernel.data.selectAny(ObjectType.User, { where: { name: 'kernel-tx-test' }});
    chai.expect(result).an('array').empty;
});

