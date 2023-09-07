import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

import { Record } from './record';
import { Schema } from './schema';
import { System, SystemUser } from './system';

function expectStringOrNull(value: any) {
    console.warn('value', value);
}

function expectRecordSet(result_set: any[]) {
    chai.expect(result_set).an('array');

    for(let result of result_set) {
        expectRecord(result);
    }
}

function expectRecord(result: any) {
    chai.expect(result).instanceOf(Record);
    chai.expect(result.data).an('object');
    chai.expect(result.info).an('object');

    chai.expect(result.data).property('id').string;
    chai.expect(result.data).property('ns').string;

    chai.expect(result.info).property('created_at').string;
    chai.expect(result.info).property('created_by');
    chai.expect(result.info).property('updated_at');
    chai.expect(result.info).property('updated_by');
    chai.expect(result.info).property('expired_at');
    chai.expect(result.info).property('expired_by');
}

describe('Schema', () => {
    let system_user: SystemUser = { id: uuid(), ns: 'test', scopes: null };
    let system: System;
    let schema_name = 'schema';

    beforeAll(async () => {
        system = await new System(system_user).startup();
    });

    afterAll(async () => {
        return system.knex.destroy();
    });

    test('runs selectAny()', async () => {
        let result = await system.data.selectAny(schema_name, {});

        expectRecordSet(result);
    });

    test('runs select404() passes with a valid ID', async () => {
        let result_any = await system.data.selectAny(schema_name, {});
        let result = result_any[0];

        chai.expect(result.data).property('id').string;

        let result_404 = await system.data.select404(schema_name, result.data.id as string);

        expectRecord(result_404);
    });

    test('runs selectIds()', async () => {

    });

    test('runs createAll()', async () => {

    });

    test('runs updateAll()', async () => {

    });

    test('runs upsertAll()', async () => {

    });

    test('runs deleteAll()', async () => {

    });

    test('runs createOne()', async () => {

    });

    test('runs updateOne()', async () => {

    });

    test('runs upsertOne()', async () => {

    });

    test('runs deleteOne()', async () => {

    });

    test('runs deleteIds()', async () => {

    });

    test('runs selectAny()', async () => {

    });

    test('runs updateAny()', async () => {

    });

    test('runs deleteAny()', async () => {

    });
    
});
