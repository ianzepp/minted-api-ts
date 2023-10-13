import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Column } from '@classes/column';
import { Record } from '@classes/record';
import { Object } from '@classes/object';

// Typedefs
import { ObjectType } from '@typedefs/object';
import { Kernel } from '@kernels/kernel';

let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

//
// meta.objects
//

test('meta.objects should not be empty after startup()', async () => {
    chai.expect(kernel.meta.objects).not.empty;
});

test('meta.objects should be populated with Object instances', async () => {
    for(let object of kernel.meta.objects) {
        chai.expect(object).instanceOf(Object);

        // Check object properties
        chai.expect(object).nested.property('data.name', object.object_name).string;
        chai.expect(object).nested.property('data.description');

        // Check object references
        chai.expect(object).property('columns');
    }
});

//
// interface
//

test('can export an object to an interface', async () => {
    let typedefs = kernel.meta.objects.map(object => object.toTypedefs());
    let typedefs_text = typedefs.join('\n');
});

//
// lifecycle testing
//

test.skip('object => database table lifecycle', async () => {
    let object_name = kernel.toTestName();
    let record_data = { name: object_name, type: 'database' };
    let record: Record;

    // Insert the new object record
    record = await kernel.data.createOne(ObjectType.Object, record_data);

    chai.expect(record).instanceOf(Record);
    chai.expect(record).property('data').a('object');
    chai.expect(record.data).property('id').string;
    chai.expect(record.data).property('ns', kernel.user_ns);
    chai.expect(record.meta).property('created_at');
    chai.expect(record.meta).property('created_by', kernel.user_id);
    chai.expect(record.meta).property('expired_at').null;
    chai.expect(record.meta).property('expired_by').null;

    // We should have the test object available
    let tested_object = kernel.meta.objects[object_name];
    let tested = await kernel.data.createOne(tested_object, {});

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

    // Expire the object record.
    record = await kernel.data.expireOne(ObjectType.Object, record);

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
    await kernel.data.selectAny(tested_object, {});

    // Delete the object record.
    record = await kernel.data.deleteOne(ObjectType.Object, record);

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
        await kernel.data.selectAny(tested_object, {});
    }

    catch (error) {
        chai.expect(error).property('message').match(/relation ".+?" does not exist/);
    }

    // Test object should be gone
    chai.expect(kernel.meta.objects).not.property(object_name);
});

test.skip('column => database table lifecycle', async () => {
    // Setup the object
    let object_name = kernel.toTestName();
    let parent_data = { name: object_name, type: 'database' };

    // Insert the new object record
    let parent = await kernel.data.createOne(ObjectType.Object, parent_data);

    chai.expect(parent).instanceOf(Record);
    chai.expect(parent).property('data').a('object');
    chai.expect(parent.data).property('id').string;
    chai.expect(parent.data).property('ns', kernel.user_ns);
    chai.expect(parent.data).property('name', parent_data.name);
    chai.expect(parent.data).property('type', parent_data.type);
    chai.expect(parent.meta).property('created_at');
    chai.expect(parent.meta).property('created_by', kernel.user_id);
    chai.expect(parent.meta).property('expired_at').null;
    chai.expect(parent.meta).property('expired_by').null;
    chai.expect(parent.meta).property('deleted_at').null;
    chai.expect(parent.meta).property('deleted_by').null;

    // Setup the column
    let record_data = { object_name: parent.data.name, name: 'test_text', type: 'text' };

    // Insert the new column record
    let record = await kernel.data.createOne(ObjectType.Column, record_data);

    chai.expect(record).instanceOf(Record);
    chai.expect(record).property('data').a('object');
    chai.expect(record.data).property('id').string;
    chai.expect(record.data).property('ns', kernel.user_ns);
    chai.expect(record.data).property('object_name', record_data.object_name);
    chai.expect(record.data).property('name', record_data.name);
    chai.expect(record.data).property('type', record_data.type);
    chai.expect(record.meta).property('created_at');
    chai.expect(record.meta).property('created_by', kernel.user_id);
    chai.expect(record.meta).property('expired_at').null;
    chai.expect(record.meta).property('expired_by').null;
    chai.expect(record.meta).property('deleted_at').null;
    chai.expect(record.meta).property('deleted_by').null;

    // Column should be present in the meta service
    chai.expect(kernel.meta.objects).property(parent_data.name).instanceOf(Object);
    chai.expect(kernel.meta.objects[parent_data.name].columns).property('test_text').instanceOf(Column);

    // We should have the test object available
    let tested_object = kernel.meta.objects[parent.data.name];
    let tested = await kernel.data.createOne(tested_object, { test_text: 'this is a column' });

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
    let [select] = await kernel.data.selectAny(tested_object, { limit: 1 });

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
    record = await kernel.data.expireOne(ObjectType.Column, record);

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
    await kernel.data.selectAny(tested_object, {});

    // Delete the object record.
    record = await kernel.data.deleteOne(ObjectType.Column, record);

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
    chai.expect(kernel.meta.objects).property(parent_data.name).instanceOf(Object);
    chai.expect(kernel.meta.objects[parent_data.name].columns).not.property('test_text');

    // Column should be deleted, so we shouldn't see the data when selected
    let [retest] = await kernel.data.selectAny(tested_object, { limit: 1 });

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
