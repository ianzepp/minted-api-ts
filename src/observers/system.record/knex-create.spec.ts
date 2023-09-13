import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { SchemaType } from '@classes/schema-type';
import { SystemAsTest } from '@classes/system';
import { RecordColumnRequiredError } from '@classes/system-data';
import { Schema } from '@classes/schema';

let system = new SystemAsTest();
let schema: Schema;

beforeEach(async () => {
    await system.startup();
    schema = await system.createTestTable();
});

afterEach(async () => {
    schema = undefined;
    await system.cleanup();
});

test('non-root cannot override record.ns', async () => {
    let result = await system.data.createOne(schema, {
        ns: 'foobar'
    });
});

test('non-root cannot override record.id', async () => {

});

test('root can override record.ns', async () => {

});

test('root can override record.id', async () => {

});