import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { RecordColumnImmutableError } from '@classes/kernel-data';
import { Tester } from '@classes/tester';

// Typedefs
import { ObjectType } from '@typedefs/object';


let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

function selectAny({ where, order, limit }) {
    return kernel.data.selectAny(ObjectType.Column, {
        where: where,
        order: order,
        limit: limit,
    });
}

function selectWhere(where: any) {
    return selectAny({ where: where, order: {}, limit: null });
}

function selectOrder(order: any) {
    return selectAny({ where: {}, order: order, limit: null });
}

function selectLimit(limit: any) {
    return selectAny({ where: {}, order: {}, limit: limit });
}

test('"where" empty search', async () => {
    let result = await selectWhere({});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column', async () => {
    let result = await selectWhere({ name: ObjectType.Column + '.required' });
    chai.expect(result).an('array').not.empty;
});

test('"where" with 3 columns', async () => {
    let result = await selectWhere({ name: ObjectType.Column + '.required', type: 'boolean' });
    chai.expect(result).an('array').not.empty;
});

test('"where" with 3 columns where 1 is incorrect', async () => {
    let result = await selectWhere({ name: ObjectType.Column + '.required', type: 'text' });
    chai.expect(result).an('array').empty;
});

test('"where" with 1 column using null', async () => {
    let result = await selectWhere({ name: null});
    chai.expect(result).an('array').empty;
});

test('"where" with 1 column using $not and null', async () => {
    let result = await selectWhere({ name: { $not: null }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column using $eq and null', async () => {
    let result = await selectWhere({ name: { $eq: null }});
    chai.expect(result).an('array').empty;
});

test('"where" with 1 column using $eq', async () => {
    let result = await selectWhere({ name: { $eq: ObjectType.Column + '.required' }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column using $ne and null', async () => {
    let result = await selectWhere({ name: { $ne: null }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column using $ne', async () => {
    let result = await selectWhere({ name: { $ne: ObjectType.Column + '.required' }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column using $gt', async () => {
    let result = await selectWhere({ name: { $gt: ObjectType.Column }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column using $gte', async () => {
    let result = await selectWhere({ name: { $gte: ObjectType.Column }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column using $lt', async () => {
    let result = await selectWhere({ name: { $lt: ObjectType.Object }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column using $lte', async () => {
    let result = await selectWhere({ name: { $lte: ObjectType.Object }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column using $in', async () => {
    let result = await selectWhere({ name: { $in: [ObjectType.Column + '.required'] }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column using $nin', async () => {
    let result = await selectWhere({ name: { $nin: [ObjectType.Column + '.required'] }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with 1 column using $find', async () => {
    let result = await selectWhere({ name: { $find: '%object%' }});
    chai.expect(result).an('array').not.empty;
});

test('"where" with $and', async () => {
    let result = await selectWhere({ $and: [
        { name: ObjectType.Column + '.required' },
        { type: 'text' }
    ]});

    chai.expect(result).an('array').not.empty;
});

test('"where" with $or', async () => {
    let result = await selectWhere({ $or: [
        { name: ObjectType.Column + '.required' },
        { name: ObjectType.Object + '.indexed' }
    ]});

    chai.expect(result).an('array').not.empty;
});

//
// Order
//

test('"order" is empty', async () => {
    let result = await selectOrder({});
    chai.expect(result).an('array').not.empty;
});

test('"order" has 1 column with sort $asc', async () => {
    let result = await selectOrder({ name: 'asc' });
    chai.expect(result).an('array').not.empty;
});

test('"order" has multiple columns with mixed sort', async () => {
    let result = await selectOrder({ name: 'asc', type: 'desc'});
    chai.expect(result).an('array').not.empty;
});

//
// Limit
//

test('"limit" is empty', async () => {
    let result = await selectLimit(null);
    chai.expect(result).an('array').not.empty;
});

test('"limit" is negative', async () => {
    let result = await selectLimit(-10);
    chai.expect(result).an('array').empty;
});

test('"limit" is 0', async () => {
    let result = await selectLimit(0);
    chai.expect(result).an('array').empty;
});

test('"limit" is 1', async () => {
    let result = await selectLimit(1);
    chai.expect(result).an('array').length(1);
});

test('"limit" is 100', async () => {
    let result = await selectLimit(100);
    chai.expect(result).an('array').length.gte(2);
});

