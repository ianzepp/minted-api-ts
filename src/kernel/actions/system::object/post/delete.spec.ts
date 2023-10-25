import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@kernel/classes/kernel';
import { Record } from '@system/classes/record';
import { ObjectType } from '@system/classes/object';
import { Column } from '@system/classes/column';
import { Object } from '@system/classes/object';

let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test('should delete a knex table', async () => {
    // Create object
    let object_name = kernel.toTestName();
    let object_data = await kernel.data.createOne(ObjectType.Object, {
        name: object_name,
    });

    // Create column
    let column_name = 'tested';
    let column_data = await kernel.data.createOne(ObjectType.Column, {
        name: object_name + '.' + column_name,
        type: 'text',
    });

    // Make sure the object was inserted
    let object = kernel.meta.lookup(object_name);
    let column = object.get(column_name);

    chai.expect(object).instanceOf(Object);
    chai.expect(column).instanceOf(Column);

    // Make sure we can insert records
    let create_data = _.set({}, column_name, 'testing data');
    await kernel.data.createOne(object, create_data);

    // Delete the object
    await kernel.data.deleteOne(ObjectType.Object, object_data);

    // Verify the object and columns are gone
    let verify_object = await kernel.data.searchAny(ObjectType.Object, { name: object_name });
    let verify_column = await kernel.data.searchAny(ObjectType.Object, { name: column_name });

    chai.expect(verify_object).a('array').length(0);
    chai.expect(verify_column).a('array').length(0);
});
