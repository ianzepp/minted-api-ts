import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Column } from '../classes/column';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { SystemAsTest } from '../classes/system';

describe('SystemMeta', () => {
    let system = new SystemAsTest();

    beforeAll(async () => {
        await system.authenticate();
        await system.startup();
    });

    afterAll(async () => {
        await system.cleanup();
    });

    test('schema => database table lifecycle', async () => {
        let record_name = "test_" + new Date().getTime();
        let record_schema = system.meta.schemas.schema;
        let record = record_schema.toRecord({ schema_name: record_name, schema_type: 'database' });

        // Insert the new schema record
        record = await system.data.createOne(record_schema, record);

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns', system.user.ns);
        chai.expect(record.meta).property('created_at');
        chai.expect(record.meta).property('created_by', system.user.id);
        chai.expect(record.meta).property('expired_at').null;
        chai.expect(record.meta).property('expired_by').null;

        // Refresh the system
        await system.meta.refresh();

        // We should have the test schema available
        let tested_schema = system.meta.schemas[record_name];
        let tested = await system.data.createOne(tested_schema, {});

        chai.expect(tested).instanceOf(Record);
        chai.expect(tested).property('data').a('object');
        chai.expect(tested.data).property('id').string;
        chai.expect(tested.data).property('ns', system.user.ns);
        chai.expect(tested.meta).property('created_at').not.null;
        chai.expect(tested.meta).property('created_by', system.user.id);
        chai.expect(tested.meta).property('expired_at').null;
        chai.expect(tested.meta).property('expired_by').null;
        chai.expect(tested.meta).property('deleted_at').null;
        chai.expect(tested.meta).property('deleted_by').null;

        // Expire the schema record.
        record = await system.data.expireOne(record_schema, record);

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns', system.user.ns);
        chai.expect(record.meta).property('created_at').not.null;
        chai.expect(record.meta).property('created_by', system.user.id);
        chai.expect(record.meta).property('expired_at').not.null;
        chai.expect(record.meta).property('expired_by', system.user.id);
        chai.expect(record.meta).property('deleted_at').null;
        chai.expect(record.meta).property('deleted_by').null;

        // Table operations should still work..
        await system.data.selectAny(tested_schema, {});

        // Delete the schema record.
        record = await system.data.deleteOne(record_schema, record);

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns', system.user.ns);
        chai.expect(record.meta).property('created_at').not.null;
        chai.expect(record.meta).property('created_by', system.user.id);
        chai.expect(record.meta).property('expired_at').not.null;
        chai.expect(record.meta).property('expired_by', system.user.id);
        chai.expect(record.meta).property('deleted_at').not.null;
        chai.expect(record.meta).property('deleted_by', system.user.id);

        // Table should be deleted, so we shouldn't be able to get data
        try {
            await system.data.selectAny(tested_schema, {});
        }

        catch (error) {
            chai.expect(error).property('message').match(/relation ".+?" does not exist/);
        }

        // Refresh the system
        await system.meta.refresh();

        // Test schema should be gone
        chai.expect(system.meta.schemas).not.property(record_name);
    });

    test('column => database table lifecycle', async () => {
        // Setup the schema
        let parent_type = system.meta.schemas.schema;
        let parent_data = { schema_name: "test_" + new Date().getTime(), schema_type: 'database' };

        // Insert the new schema record
        let parent = await system.data.createOne(parent_type, parent_data);

        chai.expect(parent).instanceOf(Record);
        chai.expect(parent).property('data').a('object');
        chai.expect(parent.data).property('id').string;
        chai.expect(parent.data).property('ns', system.user.ns);
        chai.expect(parent.data).property('schema_name', parent_data.schema_name);
        chai.expect(parent.data).property('schema_type', parent_data.schema_type);
        chai.expect(parent.meta).property('created_at');
        chai.expect(parent.meta).property('created_by', system.user.id);
        chai.expect(parent.meta).property('expired_at').null;
        chai.expect(parent.meta).property('expired_by').null;
        chai.expect(parent.meta).property('deleted_at').null;
        chai.expect(parent.meta).property('deleted_by').null;

        // Setup the column
        let record_type = system.meta.schemas.column;
        let record_data = { schema_name: parent.data.schema_name, column_name: 'test_text', column_type: 'text' };

        // Insert the new column record
        let record = await system.data.createOne(record_type, record_data);

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns', system.user.ns);
        chai.expect(record.data).property('schema_name', record_data.schema_name);
        chai.expect(record.data).property('column_name', record_data.column_name);
        chai.expect(record.data).property('column_type', record_data.column_type);
        chai.expect(record.meta).property('created_at');
        chai.expect(record.meta).property('created_by', system.user.id);
        chai.expect(record.meta).property('expired_at').null;
        chai.expect(record.meta).property('expired_by').null;
        chai.expect(record.meta).property('deleted_at').null;
        chai.expect(record.meta).property('deleted_by').null;

        // Refresh the system
        await system.meta.refresh();

        // Column should be present in the meta service
        chai.expect(system.meta.schemas).property(parent_data.schema_name).instanceOf(Schema);
        chai.expect(system.meta.schemas[parent_data.schema_name].columns).property('test_text').instanceOf(Column);

        // We should have the test schema available
        let tested_schema = system.meta.schemas[parent.data.schema_name];
        let tested = await system.data.createOne(tested_schema, { test_text: 'this is a column' });

        chai.expect(tested).instanceOf(Record);
        chai.expect(tested).property('data').a('object');
        chai.expect(tested.data).property('id').string;
        chai.expect(tested.data).property('ns', system.user.ns);
        chai.expect(tested.data).property('test_text', 'this is a column');
        chai.expect(tested.meta).property('created_at').not.null;
        chai.expect(tested.meta).property('created_by', system.user.id);
        chai.expect(tested.meta).property('expired_at').null;
        chai.expect(tested.meta).property('expired_by').null;
        chai.expect(tested.meta).property('deleted_at').null;
        chai.expect(tested.meta).property('deleted_by').null;

        // Column should be created, so we can see the data when selected
        let [select] = await system.data.selectAny(tested_schema, { limit: 1 });

        chai.expect(select).instanceOf(Record);
        chai.expect(select).property('data').a('object');
        chai.expect(select.data).property('id').string;
        chai.expect(select.data).property('ns', system.user.ns);
        chai.expect(select.data).property('test_text', 'this is a column');
        chai.expect(select.meta).property('created_at').not.null;
        chai.expect(select.meta).property('created_by', system.user.id);
        chai.expect(select.meta).property('expired_at').null;
        chai.expect(select.meta).property('expired_by').null;
        chai.expect(select.meta).property('deleted_at').null;
        chai.expect(select.meta).property('deleted_by').null;
        
        // Expire the column record.
        record = await system.data.expireOne(record_type, record);

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns', system.user.ns);
        chai.expect(record.meta).property('created_at').not.null;
        chai.expect(record.meta).property('created_by', system.user.id);
        chai.expect(record.meta).property('expired_at').not.null;
        chai.expect(record.meta).property('expired_by', system.user.id);
        chai.expect(record.meta).property('deleted_at').null;
        chai.expect(record.meta).property('deleted_by').null;

        // Table operations should still work..
        await system.data.selectAny(tested_schema, {});

        // Delete the schema record.
        record = await system.data.deleteOne(record_type, record);

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns', system.user.ns);
        chai.expect(record.meta).property('created_at').not.null;
        chai.expect(record.meta).property('created_by', system.user.id);
        chai.expect(record.meta).property('expired_at').not.null;
        chai.expect(record.meta).property('expired_by', system.user.id);
        chai.expect(record.meta).property('deleted_at').not.null;
        chai.expect(record.meta).property('deleted_by', system.user.id);

        // Refresh the system
        await system.meta.refresh();

        // Column should not be present in the meta service
        chai.expect(system.meta.schemas).property(parent_data.schema_name).instanceOf(Schema);
        chai.expect(system.meta.schemas[parent_data.schema_name].columns).not.property('test_text');

        // Column should be deleted, so we shouldn't see the data when selected
        let [retest] = await system.data.selectAny(tested_schema, { limit: 1 });

        chai.expect(retest).instanceOf(Record);
        chai.expect(retest).property('data').a('object');
        chai.expect(retest.data).property('id').string;
        chai.expect(retest.data).property('ns', system.user.ns);
        chai.expect(retest.data).not.property('test_text');
        chai.expect(retest.meta).property('created_at').not.null;
        chai.expect(retest.meta).property('created_by', system.user.id);
        chai.expect(retest.meta).property('expired_at').null;
        chai.expect(retest.meta).property('expired_by').null;
        chai.expect(retest.meta).property('deleted_at').null;
        chai.expect(retest.meta).property('deleted_by').null;
    });
});
