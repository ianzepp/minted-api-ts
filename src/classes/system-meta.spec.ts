import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { System } from '../classes/system';
import { SystemRoot } from '../classes/system-root';

describe('SystemMeta', () => {
    let system: System;
    let schema: Schema;

    beforeAll(async () => {
        system = await new System(new SystemRoot()).startup();
        schema = await system.meta.toSchema('schema');
    });

    afterAll(async () => {
        return system.knex.destroy();
    });

    test('when schema is created => create database table', async () => {
        let record_name = "system_meta_test_schema_create";
        let record = schema.toRecord({ schema_name: record_name });

        await system.data.createOne(schema, record);
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
