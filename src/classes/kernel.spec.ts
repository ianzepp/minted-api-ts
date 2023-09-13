import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { System } from '@classes/kernel';
import { SystemAsTest } from '@classes/kernel';

let system = new SystemAsTest();

beforeEach(() => system.startup());
afterEach(() => system.cleanup());

test('tx test: insert a user => should rollback', async () => {
    let result = await system.data.createOne('system.client', { name: 'system-tx-test' });
    chai.expect(result).an('object').not.empty;
});

test('tx test: verify the user does not exist', async () => {
    let result = await system.data.selectAny('system.client', { where: { name: 'system-tx-test' }});
    chai.expect(result).an('array').empty;
});

