import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@kernel/classes/kernel';
import { Column } from '@kernel/classes/column';
import { Object } from '@kernel/classes/object';

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
    let object_data = await kernel.data.createOne('system::object', {
        rn: object_name,
    });

    // Create column
    let column_name = 'tested';
    let column_data = await kernel.data.createOne('system::column', {
        rn: object_name + '.' + column_name,
        type: 'text',
    });

    // Make sure the object was inserted
    let object = kernel.meta.lookup(object_name);
    let column = object.column(column_name);

    chai.expect(object).instanceOf(Object);
    chai.expect(column).instanceOf(Column);

    // Make sure we can insert records
    let create_data = _.set({}, column_name, 'testing data');
    await kernel.data.createOne(object, create_data);

    // Delete the object
    await kernel.data.deleteOne('system::object', object_data);

    // Verify the object and columns are gone
    let verify_object = await kernel.data.searchAny('system::object', { rn: object_name });
    let verify_column = await kernel.data.searchAny('system::object', { rn: column_name });

    chai.expect(verify_object).a('array').length(0);
    chai.expect(verify_column).a('array').length(0);
});
