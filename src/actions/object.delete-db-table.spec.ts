import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Kernel } from '@root/src/kernels/kernel';
import { Record } from '@classes/record';
import { ObjectType } from '@typedefs/object';
import { Column } from '../classes/column';
import { Object } from '../classes/object';

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
    let create = await kernel.data.createOne(object, create_data);

    // Check using direct knex
    let select = await kernel.knex.driverTo(object_name, 'data').first();

    chai.expect(select).not.empty;
    chai.expect(select).property('id');
    chai.expect(select).property('ns');

    // Check that the column exists
    chai.expect(select).property('tested');
    
    // Delete the object
    let remove = await kernel.data.deleteOne(ObjectType.Object, object_data);

    // Verify the object and columns are gone
    let verify_object = await kernel.data.searchAny(ObjectType.Object, { where: { name: object_name }});
    let verify_column = await kernel.data.searchAny(ObjectType.Object, { where: { name: column_name }});

    chai.expect(verify_object).a('array').length(0);
    chai.expect(verify_column).a('array').length(0);

    // Check using direct knex
    let select_object = await kernel.knex.driverTo(object_name, 'data').select()
        .then(() => { throw new Error('Test failed') })
        .catch(error => chai.expect(error.message).includes('does not exist'));
});
