import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { SystemAsTest } from '../classes/system';
import { SchemaType } from './schema-type';

import { RecordNotFoundError } from './system-data';

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

describe('SystemData', () => {
    let system = new SystemAsTest();
    let schema_type = SchemaType.ClientUser;
    let source_data = { ns: 'test', name: 'test-user' };
    let source_list = [source_data, source_data, source_data];

    function insertSamples() {
        return system.knex.driverTo(schema_type).insert(source_list).returning('*');
    }

    describe('select methods', () => {
        let sources = [];

        beforeEach(async () => {
            await system.startup();

            // Insert dummy user records
            sources.push(... await insertSamples());
        });
    
        afterEach(async () => {
            await system.cleanup();

            // Cleanup
            sources.length = 0;
        });
    
        // selectAny()

        test('selectAny()', async () => {
            let select = await system.data.selectAny(schema_type);

            chai.expect(select).an('array').not.empty;
        });

        test('selectAny() using filter ID', async () => {
            let source = sources[0];
            let select = await system.data.selectAny(schema_type, {
                where: {
                    id: source.id
                }
            });

            chai.expect(select).an('array').length(1);
            chai.expect(select[0].data).property('id', source.id);
        });

        test('selectAny() using limit of 1', async () => {
            let select = await system.data.selectAny(schema_type, { limit: 1 });
            chai.expect(select).an('array').length(1);
        });    

        test('selectAny() using invalid limit of 0', async () => {
            let select = await system.data.selectAny(schema_type, { limit: 0 });
            chai.expect(select).an('array').length.gte(sources.length);
        });

        // selectAll()

        test('selectAll() with empty sources gives empty results', async () => {
            let select = await system.data.selectAll(schema_type, []);
            chai.expect(select).an('array').empty;
        });

        test('selectAll() with valid source IDs', async () => {
            let select = await system.data.selectAll(schema_type, [sources[0], sources[1]]);
            chai.expect(select).an('array').length(2);
        });

        test('selectAll() with duplicate source IDs', async () => {
            let select = await system.data.selectAll(schema_type, [sources[0], sources[0]]);
            chai.expect(select).an('array').length(1);
        });

        test('selectAll() with invalid source IDs', async () => {
            let select = await system.data.selectAll(schema_type, [
                { id: system.uuid() },
                { id: system.uuid() },
            ]);

            chai.expect(select).an('array').length(0);
        });

        // selectOne()

        test('selectOne() with empty source gives empty result', async () => {
            let select = await system.data.selectOne(schema_type, {});
            chai.expect(select).undefined;
        });

        test('selectOne() with valid source', async () => {
            let select = await system.data.selectOne(schema_type, sources[0]);
            chai.expect(select).instanceOf(Record);
            chai.expect(select.data).property('id', sources[0].id);
        });

        test('selectOne() with invalid source ID', async () => {
            let select = await system.data.selectOne(schema_type, { id: system.uuid() });
            chai.expect(select).undefined;
        });

        // selectIds()

        test('selectIds() with empty IDs gives empty results', async () => {
            let select = await system.data.selectIds(schema_type, []);
            chai.expect(select).an('array').empty;
        });

        test('selectIds() with valid IDs', async () => {
            let select = await system.data.selectIds(schema_type, [sources[0].id, sources[1].id]);
            chai.expect(select).an('array').length(2);
        });

        test('selectIds() with duplicate IDs', async () => {
            let select = await system.data.selectIds(schema_type, [sources[0].id, sources[0].id]);
            chai.expect(select).an('array').length(1);
        });

        test('selectIds() with invalid IDs', async () => {
            let select = await system.data.selectIds(schema_type, [system.uuid(), system.uuid()]);
            chai.expect(select).an('array').length(0);
        });


        // select404()

        test('select404() with null ID throws an error', async () => {
            let select = await system.data.select404(schema_type, null)
                .then(() => chai.assert.fail('Test failed'))
                .catch(error => chai.expect(error).instanceOf(RecordNotFoundError));
        });

        test('select404() with valid ID', async () => {
            let select = await system.data.select404(schema_type, sources[0].id);
            chai.expect(select).instanceOf(Record);
            chai.expect(select.data).property('id', sources[0].id);
        });

        test('select404() with invalid ID throws an error', async () => {
            let select = await system.data.select404(schema_type, system.uuid())
                .then(() => chai.assert.fail('Test failed'))
                .catch(error => chai.expect(error).instanceOf(RecordNotFoundError));
        });
    });


    // //
    // // System.Verb.Select
    // //
    
    // test('selectAny()', async () => {
    //     let create = await system.data.createOne(schema_path, source_data)
    //     let result = await system.data.selectAny(schema_path, {});

    //     expectRecordSet(result);
    // });

    // test('select404()', async () => {
    //     let create = await system.data.createOne(schema_path, source_data)
    //     let result = await system.data.select404(schema_path, create.data.id as string);

    //     expectRecord(result);

    //     chai.expect(result.data).property('id', create.data.id);
    // });

    // test('selectIds()', async () => {
    //     let create = await system.data.createOne(schema_path, source_data)
    //     let create_ids = [create.data.id as string];
    //     let result_set = await system.data.selectIds(schema_path, create_ids);

    //     expectRecordSet(result_set, 1);
    // });

    // //
    // // System.Verb.Create
    // //
    
    // test.skip('createOne()', async () => {

    // });

    // test('createAll()', async () => {
    //     let change_set = [source_data, source_data, source_data];

    //     // Test create
    //     let result_set = await system.data.createAll(schema_path, change_set);

    //     expectRecordSet(result_set, change_set.length);

    //     // Reselect to verify
    //     let select_set = await system.data.selectIds(schema_path, result_set.map(result => result.data.id as string));

    //     expectRecordSet(result_set, change_set.length);
    // });

    // //
    // // System.Verb.Update
    // //
    
    // test.skip('updateOne()', async () => {

    // });

    // test('updateAll()', async () => {
    //     // Test create
    //     let create_set = await system.data.createAll(schema_path, source_list);

    //     expectRecordSet(create_set, source_list.length);

    //     // Modify names
    //     for(let record of create_set) {
    //         record.data.name = record.data.name + '-changed';
    //     }

    //     // Test update
    //     let update_set = await system.data.updateAll(schema_path, create_set);

    //     expectRecordSet(update_set, create_set.length);

    //     // Reselect to verify
    //     let select_set = await system.data.selectIds(schema_path, create_set.map(change => change.data.id as string));

    //     expectRecordSet(select_set, create_set.length);
    // });

    // test.skip('updateAny()', async () => {

    // });

    // //
    // // System.Verb.Upsert
    // //
    
    // test.skip('upsertOne()', async () => {

    // });

    // test.skip('upsertAll()', async () => {

    // });

    // //
    // // System.Verb.Expire
    // //
    
    // test.skip('expireOne()', async () => {

    // });

    // test('expireAll()', async () => {
    //     // Test create
    //     let create_set = await system.data.createAll(schema_path, source_list);

    //     expectRecordSet(create_set, source_list.length);

    //     // Test delete
    //     let expire_set = await system.data.expireAll(schema_path, create_set);

    //     expectRecordSet(expire_set, create_set.length);

    //     // Reselect to verify
    //     let select_set = await system.data.selectIds(schema_path, create_set.map(change => change.data.id as string));

    //     expectRecordSet(select_set, 0);
    // });

    // test.skip('expireIds()', async () => {

    // });

    // test.skip('expireAny()', async () => {

    // });

    // //
    // // System.Verb.Delete
    // //
    
    // test('deleteIds()', async () => {
    //     // Test create
    //     let create_set = await system.data.createAll(schema_path, source_list);
    //     let create_ids = _.compact(_.uniq(create_set.map(create => create.data.id)));

    //     chai.expect(create_set, 'create_set').an('array').length(source_list.length);
    //     chai.expect(create_ids, 'create_ids').an('array').length(source_list.length);

    //     // Test delete
    //     let delete_set = await system.data.deleteIds(schema_path, create_ids);
    //     let select_set = await system.data.selectIds(schema_path, create_ids);

    //     chai.expect(select_set, 'select_set').an('array').length(0);
    // });
});
