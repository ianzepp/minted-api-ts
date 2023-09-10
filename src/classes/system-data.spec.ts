import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Record } from '../classes/record';
import { Schema, SchemaType } from '../classes/schema';
import { SystemAsTest } from '../classes/system';

function expectStringOrNull(value: any) {
    console.warn('value', value);
}

function expectRecordSet(result_set: any[], length?: number) {
    chai.expect(result_set).an('array');
    chai.expect(result_set).length(length ?? result_set.length);

    for(let result of result_set) {
        expectRecord(result);
    }
}

function expectRecord(result: any) {
    chai.expect(result).instanceOf(Record);
    chai.expect(result).property('data').an('object');
    chai.expect(result).property('meta').an('object');

    chai.expect(result.data).property('id').string;
    chai.expect(result.data).property('ns').string;

    chai.expect(result.meta).property('created_at').string;
    chai.expect(result.meta).property('created_by');
    chai.expect(result.meta).property('updated_at');
    chai.expect(result.meta).property('updated_by');
    chai.expect(result.meta).property('expired_at');
    chai.expect(result.meta).property('expired_by');
    chai.expect(result.meta).property('deleted_at');
    chai.expect(result.meta).property('deleted_by');
}

describe('classes/system-data.spec', () => {
    let system = new SystemAsTest();
    let schema_name = "test.test_" + process.hrtime().join('_');

    beforeAll(async () => {
        await system.authenticate();
        await system.startup();

        // Create the test_NNN schema
        await system.data.createOne(SchemaType.Schema, {
            schema_name: schema_name,
        });

        await system.data.createOne(SchemaType.Column, {
            schema_name: schema_name,
            column_name: 'test.name',
        });

        console.warn('schemas', system.meta.schemas);
    });

    afterAll(async () => {
        await system.cleanup();
    });

    //
    // System.Verb.Select
    //
    
    test.only('runs selectAny()', async () => {
        let create = await system.data.createOne(schema_name, { name: 'system-data.spec/selectAny'})
        let result = await system.data.selectAny(schema_name, {});

        expectRecordSet(result);
    });

    test('runs select404()', async () => {
        let create = await system.data.createOne(schema_name, { name: 'system-data.spec/select404'})
        let result = await system.data.select404(schema_name, create.data.id as string);

        expectRecord(result);

        chai.expect(result.data).property('id', create.data.id);
    });

    test('runs selectIds()', async () => {
        let create = await system.data.createOne(schema_name, { name: 'system-data.spec/selectIds'})
        let create_ids = [create.data.id as string];
        let result_set = await system.data.selectIds(schema_name, create_ids);

        expectRecordSet(result_set, 1);
    });

    //
    // System.Verb.Create
    //
    
    test.skip('runs createOne()', async () => {

    });

    test('runs createAll()', async () => {
        let change_set = [
            { name: 'system-data.spec/createAll.1' }, 
            { name: 'system-data.spec/createAll.2' }, 
            { name: 'system-data.spec/createAll.3' }, 
        ];

        // Test create
        let result_set = await system.data.createAll(schema_name, change_set);

        expectRecordSet(result_set, change_set.length);

        // Reselect to verify
        let select_set = await system.data.selectIds(schema_name, result_set.map(result => result.data.id as string));

        expectRecordSet(result_set, change_set.length);
    });

    //
    // System.Verb.Update
    //
    
    test.skip('runs updateOne()', async () => {

    });

    test('runs updateAll()', async () => {
        let source_set = [
            { name: 'system-data.spec/updateAll.0' }, 
            { name: 'system-data.spec/updateAll.1' }, 
            { name: 'system-data.spec/updateAll.2' }, 
        ];

        // Test create
        let create_set = await system.data.createAll(schema_name, source_set);

        expectRecordSet(create_set, source_set.length);

        // Modify names
        for(let record of create_set) {
            record.data.name = record.data.name + '-changed';
        }

        // Test update
        let update_set = await system.data.updateAll(schema_name, create_set);

        expectRecordSet(update_set, create_set.length);

        // Reselect to verify
        let select_set = await system.data.selectIds(schema_name, create_set.map(change => change.data.id as string));

        expectRecordSet(select_set, create_set.length);
    });

    test.skip('runs updateAny()', async () => {

    });

    //
    // System.Verb.Upsert
    //
    
    test.skip('runs upsertOne()', async () => {

    });

    test.skip('runs upsertAll()', async () => {

    });

    //
    // System.Verb.Expire
    //
    
    test.skip('runs expireOne()', async () => {

    });

    test('runs expireAll()', async () => {
        let source_set = [
            { name: 'system-data.spec/expireAll.0' }, 
            { name: 'system-data.spec/expireAll.1' }, 
            { name: 'system-data.spec/expireAll.2' }, 
        ];

        // Test create
        let create_set = await system.data.createAll(schema_name, source_set);

        expectRecordSet(create_set, source_set.length);

        // Test delete
        let expire_set = await system.data.expireAll(schema_name, create_set);

        expectRecordSet(expire_set, create_set.length);

        // Reselect to verify
        let select_set = await system.data.selectIds(schema_name, create_set.map(change => change.data.id as string));

        expectRecordSet(select_set, 0);
    });

    test.skip('runs expireIds()', async () => {

    });

    test.skip('runs expireAny()', async () => {

    });

    //
    // System.Verb.Delete
    //
    
    test.skip('runs deleteOne()', async () => {

    });

    test('runs deleteAll()', async () => {
        let source_set = [
            { name: 'system-data.spec/deleteAll.0' }, 
            { name: 'system-data.spec/deleteAll.1' }, 
            { name: 'system-data.spec/deleteAll.2' }, 
        ];

        // Test create
        let create_set = await system.data.createAll(schema_name, source_set);

        expectRecordSet(create_set, source_set.length);

        // Test delete
        let delete_set = await system.data.deleteAll(schema_name, create_set);

        expectRecordSet(delete_set, create_set.length);

        // Reselect to verify
        let select_set = await system.data.selectIds(schema_name, create_set.map(change => change.data.id as string));

        expectRecordSet(select_set, 0);
    });

    test.skip('runs deleteIds()', async () => {

    });

    test.skip('runs deleteAny()', async () => {

    });
});
