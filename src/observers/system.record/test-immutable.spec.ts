import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { RecordColumnImmutableError } from '@classes/system-data';
import { SchemaType } from '@classes/schema-type';
import { SystemAsTest } from '@classes/system';

let system = new SystemAsTest();
let schema_name = system.toTestSchemaName();

beforeEach(async () => {
    await system.startup();
});

afterEach(async () => {
    await system.cleanup();
});

test('immutable column should throw an error', async () => {
    await system.data.createOne(SchemaType.Schema, {
            schema_name: schema_name 
    });
    
    await system.data.createOne(SchemaType.Column, { 
        schema_name: schema_name, 
        column_name: 'test_column', 
        column_type: 'text',
        immutable: true 
    });

    // Should be able to create a record
    let record = await system.data.createOne(schema_name, {
        test_column: 'some value'
    });

    // Change the value
    record.data.test_column = 'changed value';

    // Should not be able to change the value
    await system.data.updateOne(schema_name, record)
        .then(() => chai.assert.fail('Should not be able to create a record without the value'))
        .catch(error => chai.expect(error).instanceOf(RecordColumnImmutableError));
});
