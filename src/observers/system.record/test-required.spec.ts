import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { SchemaType } from '@classes/schema-type';
import { SystemAsTest } from '@classes/system';
import { RecordColumnRequiredError } from '@classes/system-data';

let system = new SystemAsTest();
let schema_name = system.toTestSchemaName();

beforeEach(async () => {
    await system.startup();
});

afterEach(async () => {
    await system.cleanup();
});

test('required column should throw an error', async () => {
    await system.data.createOne(SchemaType.Schema, {
        schema_name: schema_name 
    });
    
    await system.data.createOne(SchemaType.Column, { 
        schema_name: schema_name, 
        column_name: 'test_column', 
        column_type: 'text',
        required: true 
    });

    // Should be able to create a record
    let record = await system.data.createOne(schema_name, {
        test_column: 'some value'
    });

    // Should not be able to create a record without the value
    await system.data.createOne(schema_name, {})
        .then(() => chai.assert.fail('Should not be able to create a record without the value'))
        .catch(error => chai.expect(error).instanceOf(RecordColumnRequiredError));

    // // Should not be able to update back to a null value
    await system.data.updateOne(schema_name, { id: record.data.id, test_column: null })
        .then(() => chai.assert.fail('Should not be able to update back to a null value'))
        .catch(error => chai.expect(error).instanceOf(RecordColumnRequiredError));
});