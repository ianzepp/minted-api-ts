import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";
import { Server } from '@system/classes/server';

test('server starts', async () => {
    new Server();
});

