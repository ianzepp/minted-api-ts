import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { System } from '../classes/system';

describe('SystemMeta', () => {
    let system: System;
    let schema: Schema;

    beforeAll(async () => {
        system = await new System({ id: uuid(), ns: 'test', scopes: null }).startup();
        schema = await system.meta.schemas.schema;
    });

    afterAll(async () => {
        return system.knex.destroy();
    });

    test('when schema is created => create database table', async () => {
        let record_name = "test_" + new Date().getTime();
        let record = schema.toRecord({ schema_name: record_name, schema_type: 'database' });

        // Insert the new schema record
        await system.data.createOne(schema, record);

        // Refresh the system
        await system.meta.startup();

        // Now that the test schema is inserted, we should be able to create a new record of that type
        let result = await system.data.createOne(record_name, {});

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns').string;
    });

    test('when schema is expired => no changes', async () => {

    });    

    test('when schema is deleted => delete database table', async () => {

    });    

    test('when column is created => modify database table', async () => {

    });    

    test('when column is expired => no changes', async () => {

    });    

    test('when column is deleted => modify database table', async () => {

    });    
});
