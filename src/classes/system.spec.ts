import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { System } from '@classes/system';
import { SystemAsTest } from '@classes/system';

describe('System', () => {
    let system = new SystemAsTest();

    beforeEach(() => system.startup());
    afterEach(() => system.cleanup());

    test.only('tx test: insert a user => should rollback', async () => {
        let result = await system.data.createOne('system.client_user', { name: 'system-tx-test' });
        chai.expect(result).an('object').not.empty;
    });

    test('tx test: verify the user does not exist', async () => {
        let result = await system.data.selectAny('system.client_user', { where: { name: 'system-tx-test' }});
        chai.expect(result).an('array').empty;
    });
});
