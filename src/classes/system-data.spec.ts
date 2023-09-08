import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { System } from '../classes/system';

// Layouts
import { SystemUser } from '../layouts/system';

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
}

describe('SystemData', () => {
    let system_user: SystemUser = { id: uuid(), ns: 'test', scopes: null };
    let system: System;
    let schema_name = 'schema';
    let schema: Schema;

    beforeAll(async () => {
        system = await new System(system_user).startup();
        schema = await system.meta.schemas.test;
    });

    afterAll(async () => {
        await system.data.deleteAny(schema, {});
        await system.knex.destroy();
    });

    test('runs selectAny()', async () => {
        let create = await system.data.createOne(schema, { test: 'system-data.spec/selectAny'})
        let result = await system.data.selectAny(schema, {});

        expectRecordSet(result);
    });

    test('runs select404()', async () => {
        let create = await system.data.createOne(schema, { test: 'system-data.spec/select404'})
        let result = await system.data.select404(schema, create.data.id as string);

        expectRecord(result);

        chai.expect(result.data).property('id', create.data.id);
    });

    test('runs selectIds()', async () => {
        let create = await system.data.createOne(schema, { test: 'system-data.spec/selectIds'})
        let create_ids = [create.data.id as string];
        let result_set = await system.data.selectIds(schema, create_ids);

        expectRecordSet(result_set, 1);
    });

    test.skip('runs createOne()', async () => {

    });

    test('runs createAll()', async () => {
        let change_set = [
            schema.toRecord({ test: 'system-data.spec/createAll.1' }), 
            schema.toRecord({ test: 'system-data.spec/createAll.2' }), 
            schema.toRecord({ test: 'system-data.spec/createAll.3' }), 
        ];

        // Test create
        let result_set = await system.data.createAll(schema, change_set);

        expectRecordSet(result_set, change_set.length);

        // Reselect to verify
        let select_set = await system.data.selectIds(schema, change_set.map(change => change.data.id as string));

        expectRecordSet(result_set, change_set.length);
    });

    test.skip('runs updateOne()', async () => {

    });

    test('runs updateAll()', async () => {
        let source_set = [
            schema.toRecord({ test: 'system-data.spec/updateAll.0' }), 
            schema.toRecord({ test: 'system-data.spec/updateAll.1' }), 
            schema.toRecord({ test: 'system-data.spec/updateAll.2' }), 
        ];

        // Test create
        let create_set = await system.data.createAll(schema, source_set);

        expectRecordSet(create_set, source_set.length);

        // Modify names
        for(let record of create_set) {
            record.data.test = record.data.test + '-changed';
        }

        // Test update
        let update_set = await system.data.updateAll(schema, create_set);

        expectRecordSet(update_set, create_set.length);

        // Reselect to verify
        let select_set = await system.data.selectIds(schema, create_set.map(change => change.data.id as string));

        expectRecordSet(select_set, create_set.length);
    });

    test.skip('runs updateAny()', async () => {

    });

    test.skip('runs upsertOne()', async () => {

    });

    test.skip('runs upsertAll()', async () => {

    });

    test.skip('runs deleteOne()', async () => {

    });

    test('runs deleteAll()', async () => {
        let source_set = [
            schema.toRecord({ test: 'system-data.spec/updateAll.0' }), 
            schema.toRecord({ test: 'system-data.spec/updateAll.1' }), 
            schema.toRecord({ test: 'system-data.spec/updateAll.2' }), 
        ];

        // Test create
        let create_set = await system.data.createAll(schema, source_set);

        expectRecordSet(create_set, source_set.length);

        // Test delete
        let delete_set = await system.data.deleteAll(schema, create_set);

        expectRecordSet(delete_set, create_set.length);

        // Reselect to verify
        let select_set = await system.data.selectIds(schema, create_set.map(change => change.data.id as string));

        expectRecordSet(select_set, 0);
    });

    test.skip('runs deleteIds()', async () => {

    });

    test.skip('runs deleteAny()', async () => {

    });
    
});
