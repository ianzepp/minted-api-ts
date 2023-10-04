import _ from 'lodash';
import chai from 'chai';

// Classes
import { Kernel } from '@classes/kernel';
import { Tester } from '@classes/tester';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";
import { Server } from '@classes/server';

test('server starts', async () => {
    new Server();
});

