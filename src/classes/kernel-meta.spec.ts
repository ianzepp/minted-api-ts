import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Column } from '@classes/column';
import { Tester } from '@classes/tester';
import { Record } from '@classes/record';
import { Schema } from '@classes/schema';

// Typedefs
import { SchemaType } from '@typedefs/schema';

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test.skip('schema => database table lifecycle', async () => {
    let schema_name = kernel.toTestSchemaName();
    let record_data = { schema_name: schema_name, schema_type: 'database' };
    let record: Record;

    // Insert the new schema record
    record = await kernel.data.createOne(SchemaType.Schema, record_data);

    chai.expect(record).instanceOf(Record);
    chai.expect(record).property('data').a('object');
    chai.expect(record.data).property('id').string;
    chai.expect(record.data).property('ns', kernel.user_ns);
    chai.expect(record.meta).property('created_at');
    chai.expect(record.meta).property('created_by', kernel.user_id);
    chai.expect(record.meta).property('expired_at').null;
    chai.expect(record.meta).property('expired_by').null;

    // We should have the test schema available
    let tested_schema = kernel.meta.schemas[schema_name];
    let tested = await kernel.data.createOne(tested_schema, {});

    chai.expect(tested).instanceOf(Record);
    chai.expect(tested).property('data').a('object');
    chai.expect(tested.data).property('id').string;
    chai.expect(tested.data).property('ns', kernel.user_ns);
    chai.expect(tested.meta).property('created_at').not.null;
    chai.expect(tested.meta).property('created_by', kernel.user_id);
    chai.expect(tested.meta).property('expired_at').null;
    chai.expect(tested.meta).property('expired_by').null;
    chai.expect(tested.meta).property('deleted_at').null;
    chai.expect(tested.meta).property('deleted_by').null;

    // Expire the schema record.
    record = await kernel.data.expireOne(SchemaType.Schema, record);

    chai.expect(record).instanceOf(Record);
    chai.expect(record).property('data').a('object');
    chai.expect(record.data).property('id').string;
    chai.expect(record.data).property('ns', kernel.user_ns);
    chai.expect(record.meta).property('created_at').not.null;
    chai.expect(record.meta).property('created_by', kernel.user_id);
    chai.expect(record.meta).property('expired_at').not.null;
    chai.expect(record.meta).property('expired_by', kernel.user_id);
    chai.expect(record.meta).property('deleted_at').null;
    chai.expect(record.meta).property('deleted_by').null;

    // Table operations should still work..
    await kernel.data.selectAny(tested_schema, {});

    // Delete the schema record.
    record = await kernel.data.deleteOne(SchemaType.Schema, record);

    chai.expect(record).instanceOf(Record);
    chai.expect(record).property('data').a('object');
    chai.expect(record.data).property('id').string;
    chai.expect(record.data).property('ns', kernel.user_ns);
    chai.expect(record.meta).property('created_at').not.null;
    chai.expect(record.meta).property('created_by', kernel.user_id);
    chai.expect(record.meta).property('expired_at').not.null;
    chai.expect(record.meta).property('expired_by', kernel.user_id);
    chai.expect(record.meta).property('deleted_at').not.null;
    chai.expect(record.meta).property('deleted_by', kernel.user_id);

    // Table should be deleted, so we shouldn't be able to get data
    try {
        await kernel.data.selectAny(tested_schema, {});
    }

    catch (error) {
        chai.expect(error).property('message').match(/relation ".+?" does not exist/);
    }

    // Test schema should be gone
    chai.expect(kernel.meta.schemas).not.property(schema_name);
});

test.skip('column => database table lifecycle', async () => {
    // Setup the schema
    let schema_name = kernel.toTestSchemaName();
    let parent_data = { schema_name: schema_name, schema_type: 'database' };

    // Insert the new schema record
    let parent = await kernel.data.createOne(SchemaType.Schema, parent_data);

    chai.expect(parent).instanceOf(Record);
    chai.expect(parent).property('data').a('object');
    chai.expect(parent.data).property('id').string;
    chai.expect(parent.data).property('ns', kernel.user_ns);
    chai.expect(parent.data).property('schema_name', parent_data.schema_name);
    chai.expect(parent.data).property('schema_type', parent_data.schema_type);
    chai.expect(parent.meta).property('created_at');
    chai.expect(parent.meta).property('created_by', kernel.user_id);
    chai.expect(parent.meta).property('expired_at').null;
    chai.expect(parent.meta).property('expired_by').null;
    chai.expect(parent.meta).property('deleted_at').null;
    chai.expect(parent.meta).property('deleted_by').null;

    // Setup the column
    let record_data = { schema_name: parent.data.schema_name, column_name: 'test_text', column_type: 'text' };

    // Insert the new column record
    let record = await kernel.data.createOne(SchemaType.Column, record_data);

    chai.expect(record).instanceOf(Record);
    chai.expect(record).property('data').a('object');
    chai.expect(record.data).property('id').string;
    chai.expect(record.data).property('ns', kernel.user_ns);
    chai.expect(record.data).property('schema_name', record_data.schema_name);
    chai.expect(record.data).property('column_name', record_data.column_name);
    chai.expect(record.data).property('column_type', record_data.column_type);
    chai.expect(record.meta).property('created_at');
    chai.expect(record.meta).property('created_by', kernel.user_id);
    chai.expect(record.meta).property('expired_at').null;
    chai.expect(record.meta).property('expired_by').null;
    chai.expect(record.meta).property('deleted_at').null;
    chai.expect(record.meta).property('deleted_by').null;

    // Column should be present in the meta service
    chai.expect(kernel.meta.schemas).property(parent_data.schema_name).instanceOf(Schema);
    chai.expect(kernel.meta.schemas[parent_data.schema_name].columns).property('test_text').instanceOf(Column);

    // We should have the test schema available
    let tested_schema = kernel.meta.schemas[parent.data.schema_name];
    let tested = await kernel.data.createOne(tested_schema, { test_text: 'this is a column' });

    chai.expect(tested).instanceOf(Record);
    chai.expect(tested).property('data').a('object');
    chai.expect(tested.data).property('id').string;
    chai.expect(tested.data).property('ns', kernel.user_ns);
    chai.expect(tested.data).property('test_text', 'this is a column');
    chai.expect(tested.meta).property('created_at').not.null;
    chai.expect(tested.meta).property('created_by', kernel.user_id);
    chai.expect(tested.meta).property('expired_at').null;
    chai.expect(tested.meta).property('expired_by').null;
    chai.expect(tested.meta).property('deleted_at').null;
    chai.expect(tested.meta).property('deleted_by').null;

    // Column should be created, so we can see the data when selected
    let [select] = await kernel.data.selectAny(tested_schema, { limit: 1 });

    chai.expect(select).instanceOf(Record);
    chai.expect(select).property('data').a('object');
    chai.expect(select.data).property('id').string;
    chai.expect(select.data).property('ns', kernel.user_ns);
    chai.expect(select.data).property('test_text', 'this is a column');
    chai.expect(select.meta).property('created_at').not.null;
    chai.expect(select.meta).property('created_by', kernel.user_id);
    chai.expect(select.meta).property('expired_at').null;
    chai.expect(select.meta).property('expired_by').null;
    chai.expect(select.meta).property('deleted_at').null;
    chai.expect(select.meta).property('deleted_by').null;
    
    // Expire the column record.
    record = await kernel.data.expireOne(SchemaType.Column, record);

    chai.expect(record).instanceOf(Record);
    chai.expect(record).property('data').a('object');
    chai.expect(record.data).property('id').string;
    chai.expect(record.data).property('ns', kernel.user_ns);
    chai.expect(record.meta).property('created_at').not.null;
    chai.expect(record.meta).property('created_by', kernel.user_id);
    chai.expect(record.meta).property('expired_at').not.null;
    chai.expect(record.meta).property('expired_by', kernel.user_id);
    chai.expect(record.meta).property('deleted_at').null;
    chai.expect(record.meta).property('deleted_by').null;

    // Table operations should still work..
    await kernel.data.selectAny(tested_schema, {});

    // Delete the schema record.
    record = await kernel.data.deleteOne(SchemaType.Column, record);

    chai.expect(record).instanceOf(Record);
    chai.expect(record).property('data').a('object');
    chai.expect(record.data).property('id').string;
    chai.expect(record.data).property('ns', kernel.user_ns);
    chai.expect(record.meta).property('created_at').not.null;
    chai.expect(record.meta).property('created_by', kernel.user_id);
    chai.expect(record.meta).property('expired_at').not.null;
    chai.expect(record.meta).property('expired_by', kernel.user_id);
    chai.expect(record.meta).property('deleted_at').not.null;
    chai.expect(record.meta).property('deleted_by', kernel.user_id);

    // Column should not be present in the meta service
    chai.expect(kernel.meta.schemas).property(parent_data.schema_name).instanceOf(Schema);
    chai.expect(kernel.meta.schemas[parent_data.schema_name].columns).not.property('test_text');

    // Column should be deleted, so we shouldn't see the data when selected
    let [retest] = await kernel.data.selectAny(tested_schema, { limit: 1 });

    chai.expect(retest).instanceOf(Record);
    chai.expect(retest).property('data').a('object');
    chai.expect(retest.data).property('id').string;
    chai.expect(retest.data).property('ns', kernel.user_ns);
    chai.expect(retest.data).not.property('test_text');
    chai.expect(retest.meta).property('created_at').not.null;
    chai.expect(retest.meta).property('created_by', kernel.user_id);
    chai.expect(retest.meta).property('expired_at').null;
    chai.expect(retest.meta).property('expired_by').null;
    chai.expect(retest.meta).property('deleted_at').null;
    chai.expect(retest.meta).property('deleted_by').null;
});
