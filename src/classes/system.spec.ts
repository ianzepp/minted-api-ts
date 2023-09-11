import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { System } from '../classes/system';
import { SystemAsTest } from '../classes/system';

describe('system.spec', () => {
    let system = new SystemAsTest();

    beforeEach(async () => {
        await system.startup();
    });

    afterEach(async () => {
        await system.cleanup();
    })

    test('system.knex.tx is disabled', async () => {
        // return system.data.createOne('user', { username: 'foobar' });
    });

    test('system.knex.tx is enabled', async () => {
        // await system.data.createOne('user', { username: 'foobar' });
    });
});
