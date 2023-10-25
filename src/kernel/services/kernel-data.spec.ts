import _ from 'lodash';
import chai, { AssertionError } from 'chai';

// Bun:test
import { beforeEach, afterEach, test } from "bun:test";

// Classes
import { Record } from '@kernel/classes/record';
import { Kernel } from '@kernel/classes/kernel';

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

// Test suite
let kernel = new Kernel();
let object_type = 'system::test';
let source_data = [
    { name: 'test-0' },
    { name: 'test-1' },
    { name: 'test-2' },
];

let records: Record[] = [];

function updateSamples() {
    return records.map(record => {
        return { id: record.data.id, name: record.data.name + '-updated' };
    });
}

function testUpdateAll(result: Record[], length: number) {
    chai.expect(result).an('array').length(length);
    result.forEach(testUpdateOne);
}

function testUpdateOne(record: Record) {
    chai.expect(record).instanceOf(Record);
    chai.expect(record.data).property('name').includes('-updated');
}

function testExpireAll(result: Record[], length: number) {
    chai.expect(result).an('array').length(length);
    result.forEach(testExpireOne);
}

function testExpireOne(record: Record) {
    chai.expect(record).instanceOf(Record);
    chai.expect(record.meta).property('expired_at').string;
    chai.expect(record.meta).property('expired_by').string;
}

function testDeleteAll(result: Record[], length: number) {
    chai.expect(result).an('array').length(length);
    result.forEach(testDeleteOne);
}

function testDeleteOne(record: Record) {
    chai.expect(record).instanceOf(Record);
    chai.expect(record.meta).property('deleted_at').string;
    chai.expect(record.meta).property('deleted_by').string;
}

beforeEach(async () => {
    await kernel.startup();

    // Insert dummy user records
    records.push(... await kernel.data.createAll(object_type, source_data));
});

afterEach(async () => {
    await kernel.cleanup();

    // Cleanup
    records.length = 0;
});

test('selectAny()', async () => {
    let select = await kernel.data.selectAny(object_type);

    chai.expect(select).an('array').not.empty;
});

test('selectAny() using filter ID', async () => {
    let source = records[0];
    let select = await kernel.data.selectAny(object_type, {
        where: {
            id: source.data.id
        }
    });

    chai.expect(select).an('array').length(1);
    chai.expect(select[0].data).property('id', source.data.id);
});

test('selectAny() using limit of 1', async () => {
    let select = await kernel.data.selectAny(object_type, { limit: 1 });
    chai.expect(select).an('array').length(1);
});    

test('selectAny() using limit of 0', async () => {
    let select = await kernel.data.selectAny(object_type, { limit: 0 });
    chai.expect(select).an('array').length(0);
});

// selectAll()

test('selectAll() with empty sources gives empty results', async () => {
    let select = await kernel.data.selectAll(object_type, []);
    chai.expect(select).an('array').empty;
});

test('selectAll() with valid source IDs', async () => {
    let select = await kernel.data.selectAll(object_type, [records[0], records[1]]);
    chai.expect(select).an('array').length(2);
});

test('selectAll() with duplicate source IDs', async () => {
    let select = await kernel.data.selectAll(object_type, [records[0], records[0]]);
    chai.expect(select).an('array').length(1);
});

test('selectAll() with invalid source IDs', async () => {
    let select = await kernel.data.selectAll(object_type, [
        { id: kernel.uuid() },
        { id: kernel.uuid() },
    ]);

    chai.expect(select).an('array').length(0);
});

// selectOne()

test('selectOne() with empty source gives empty result', async () => {
    let select = await kernel.data.selectOne(object_type, {});
    chai.expect(select).undefined;
});

test('selectOne() with valid source', async () => {
    let select = await kernel.data.selectOne(object_type, records[0]);
    chai.expect(select).instanceOf(Record);
    chai.expect(select.data).property('id', records[0].data.id);
});

test('selectOne() with invalid source ID', async () => {
    let select = await kernel.data.selectOne(object_type, { id: kernel.uuid() });
    chai.expect(select).undefined;
});

// selectIds()

test('selectIds() with empty IDs gives empty results', async () => {
    let select = await kernel.data.selectIds(object_type, []);
    chai.expect(select).an('array').empty;
});

test('selectIds() with valid IDs', async () => {
    let select = await kernel.data.selectIds(object_type, [records[0].data.id, records[1].data.id]);
    chai.expect(select).an('array').length(2);
});

test('selectIds() with duplicate IDs', async () => {
    let select = await kernel.data.selectIds(object_type, [records[0].data.id, records[0].data.id]);
    chai.expect(select).an('array').length(1);
});

test('selectIds() with invalid IDs', async () => {
    let select = await kernel.data.selectIds(object_type, [kernel.uuid(), kernel.uuid()]);
    chai.expect(select).an('array').length(0);
});


// select404()

test('select404() with null ID should fail !!', async () => {
    let select = await kernel.data.select404(object_type, null)
        .then(() => chai.assert.fail('Test failed'))
        .catch(error => chai.expect(error).property('message', '404'));
});

test('select404() with valid ID', async () => {
    let select = await kernel.data.select404(object_type, records[0].data.id);
    chai.expect(select).instanceOf(Record);
    chai.expect(select.data).property('id', records[0].data.id);
});

test('select404() with invalid ID should fail !!', async () => {
    let select = await kernel.data.select404(object_type, kernel.uuid())
        .then(() => chai.assert.fail('Test failed'))
        .catch(error => chai.expect(error).property('message', '404'));
});

// create

test('createAll() with sources', async () => {
    let result = await kernel.data.createAll(object_type, source_data);
    chai.expect(result).an('array').length(3);
});

test('createAll() with an empty array', async () => {
    let result = await kernel.data.createAll(object_type, []);
    chai.expect(result).an('array').length(0);
});

test('createAll() with a single source', async () => {
    let result = await kernel.data.createAll(object_type, [source_data[0]]);
    chai.expect(result).an('array').length(1);
});

test.skip('createAll() with a single source and an ID should fail !!', async () => {
    let source = _.assign({ id: kernel.uuid() }, source_data[0]);
    let result = await kernel.data.createAll(object_type, [source])
        .then(() => chai.assert.fail('Test failed'))
        .catch(error => chai.expect(error.message).includes('E_ID_EXISTS'));
});

test('createAll() missing required data should fail !!', async () => {
    let source = _.assign({}, _.omit(source_data[0], 'name'));
    let result = await kernel.data.createAll(object_type, [source])
        .then(() => chai.assert.fail('Test failed'))
        .catch(error => chai.expect(error.message).includes("to have property 'name'"));
});

test('createAll() with unknown columns should fail !!', async () => {
    let source = _.assign({ special_sauce: true }, source_data[0]);
    let result = await kernel.data.createAll(object_type, [source])
        .then(() => chai.assert.fail('Test failed'))
        .catch(error => chai.expect(error).instanceOf(Error)); // TODO fix class type
});

test('createOne() with source data', async () => {
    let result = await kernel.data.createOne(object_type, source_data[0]);
    chai.expect(result).instanceOf(Record);
    chai.expect(result.data).property('id').string;
});

test.skip('createOne() with an existing ID should fail !!', async () => {
    let source = _.assign({ id: kernel.uuid() }, source_data[0]);
    let result = await kernel.data.createOne(object_type, source)
        .then(() => chai.assert.fail('Test failed'))
        .catch(error => chai.expect(error.message).includes('E_ID_EXISTS'));
});

test('createOne() missing required data should fail !!', async () => {
    let source = _.assign({}, _.omit(source_data[0], 'name'));
    let result = await kernel.data.createOne(object_type, source)
        .then(() => chai.assert.fail('Test failed'))
        .catch(error => chai.expect(error.message).includes("to have property 'name'"));
});

test('createOne() with unknown columns should fail !!', async () => {
    let source = _.assign({ special_sauce: true }, source_data[0]);
    let result = await kernel.data.createOne(object_type, source)
        .then(() => chai.assert.fail('Test failed'))
        .catch(error => chai.expect(error).instanceOf(Error)); // TODO fix class type
});

// update

test('updateAll() with sources', async () => {
    let source_data = updateSamples();

    testUpdateAll(await kernel.data.updateAll(object_type, source_data), source_data.length);
    testUpdateAll(await kernel.data.selectAll(object_type, source_data), source_data.length);
});

test('updateAll() with an empty array', async () => {
    testUpdateAll(await kernel.data.updateAll(object_type, []), 0);
});

test('updateAll() with a single source', async () => {
    let source_data = updateSamples();
    let source = source_data[0];

    testUpdateAll(await kernel.data.updateAll(object_type, [source]), 1);
    testUpdateAll(await kernel.data.selectAll(object_type, [source]), 1);
});

test('updateOne() with sources', async () => {
    let source_data = updateSamples();
    let source = source_data[0];

    testUpdateOne(await kernel.data.updateOne(object_type, source));
    testUpdateOne(await kernel.data.selectOne(object_type, source));
});

test('updateOne() with an empty object should fail !!', async () => {
    await kernel.data.updateOne(object_type, {})
        .then(() => chai.assert.fail('Test failed'))
        .catch(error => chai.expect(error).instanceOf(AssertionError));
});

test('updateAny() with a valid filter and change data', async () => {
    let source_data = updateSamples();
    let filter = { where: { id: _.map(source_data, 'id') }};
    let change = { name: 'name-updated' };

    testUpdateAll(await kernel.data.updateAny(object_type, filter, change), source_data.length);
    testUpdateAll(await kernel.data.selectAll(object_type, source_data), source_data.length);
});

test('updateIds() with valid IDs and change data', async () => {
    let source_data = updateSamples();
    let record_ids = _.map(source_data, 'id');
    let change_data = { name: 'name-updated' };

    testUpdateAll(await kernel.data.updateIds(object_type, record_ids, change_data), source_data.length);
    testUpdateAll(await kernel.data.selectAll(object_type, source_data), source_data.length);
});

// expire

test('expireAll() with sources', async () => {
    testExpireAll(await kernel.data.expireAll(object_type, records), records.length);
    testExpireAll(await kernel.data.selectAll(object_type, records), 0);
});

test('expireAll() with an empty array', async () => {
    testExpireAll(await kernel.data.expireAll(object_type, []), 0);
});

test('expireAll() with a single source', async () => {
    testExpireAll(await kernel.data.expireAll(object_type, [records[0]]), 1);
    testExpireAll(await kernel.data.selectAll(object_type, [records[0]]), 0);
});

test('expireOne() with source data', async () => {
    testExpireOne(await kernel.data.expireOne(object_type, records[0]));
    testExpireAll(await kernel.data.selectAll(object_type, [records[0]]), 0);
});

test('expireAny() with source IDs', async () => {
    let filter = { where: { id: _.map(records, 'data.id') }};

    testExpireAll(await kernel.data.expireAny(object_type, filter), records.length);
    testExpireAll(await kernel.data.selectAll(object_type, records), 0);
});

test('expireIds() with source IDs', async () => {
    let record_ids = _.map(records, 'data.id');

    testExpireAll(await kernel.data.expireIds(object_type, record_ids), records.length);
    testExpireAll(await kernel.data.selectAll(object_type, records), 0);
});

// delete

test('deleteAll() with sources', async () => {
    testDeleteAll(await kernel.data.deleteAll(object_type, records), records.length);
    testDeleteAll(await kernel.data.selectAll(object_type, records), 0);
});

test('deleteAll() with an empty array', async () => {
    testDeleteAll(await kernel.data.deleteAll(object_type, []), 0);
});

test('deleteAll() with a single source', async () => {
    testDeleteAll(await kernel.data.deleteAll(object_type, [records[0]]), 1);
    testDeleteAll(await kernel.data.selectAll(object_type, [records[0]]), 0);
});

test('deleteOne() with source data', async () => {
    testDeleteOne(await kernel.data.deleteOne(object_type, records[0]));
    testDeleteAll(await kernel.data.selectAll(object_type, [records[0]]), 0);
});

test('deleteAny() with source IDs', async () => {
    let filter = { where: { id: _.map(records, 'data.id') }};

    testDeleteAll(await kernel.data.deleteAny(object_type, filter), records.length);
    testDeleteAll(await kernel.data.selectAll(object_type, records), 0);
});

test('deleteIds() with source IDs', async () => {
    let record_ids = _.map(records, 'data.id');

    testDeleteAll(await kernel.data.deleteIds(object_type, record_ids), records.length);
    testDeleteAll(await kernel.data.selectAll(object_type, records), 0);
});

