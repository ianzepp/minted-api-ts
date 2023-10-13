import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { ObjectType } from '@system/typedefs/object';
import { RouterReq } from '@system/typedefs/router-req';
import { RouterRes } from '@system/typedefs/router-res';
import { toJSON } from '@system/classes/helper';

// Router for testing
import RouterTest from '@system/routers/data-update-all';
import { Kernel } from '@system/kernels/kernel';

let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

async function verifyOne(source_name: string, result: any) {
    let record = toJSON(result);

    chai.expect(record).a('object');
    chai.expect(record).nested.property('data.id').string;
    chai.expect(record).nested.property('data.name', source_name);
    chai.expect(record).nested.property('meta.created_at').string;
    chai.expect(record).nested.property('meta.created_by').string;
    chai.expect(record).nested.property('meta.updated_at').string;
    chai.expect(record).nested.property('meta.updated_by').string;

    // Confirm the record exists in the system
    let select = await kernel.data.select404(ObjectType.Test, record.data.id);

    chai.expect(record).a('object');
    chai.expect(record).nested.property('data.id', record.data.id).string;
    chai.expect(record).nested.property('data.name', record.data.name);
    chai.expect(record).nested.property('meta.created_at', record.meta.created_at);
    chai.expect(record).nested.property('meta.created_by', record.meta.created_by);
    chai.expect(record).nested.property('meta.updated_at', record.meta.updated_at);
    chai.expect(record).nested.property('meta.updated_by', record.meta.updated_by);
}

function createRouterReq(body: any): RouterReq {
    return {
        verb: 'PATCH',
        path: '/api/data/' + ObjectType.Test,
        params: { object: ObjectType.Test },
        search: {},
        body: body
    };
}

function createRouterRes(): RouterRes {
    return {
        status: 0,
        length: 0,
        object: undefined,
        record: undefined,
        filter: undefined,
        result: undefined,
    };
}

test('update one record', async () => {
    let router = new RouterTest();

    // Create the records
    let create = await kernel.data.createAll(ObjectType.Test, [
        { name: 'foo' },
    ]);

    // Verify
    await verifyOne('foo', create[0]);

    // Build the structures
    let router_req = createRouterReq([
        { id: create[0].data.id, name: 'foo-updated' }
    ]);

    let router_res = createRouterRes();

    // Run the router
    let result = await router.runsafe(kernel, router_req, router_res);

    chai.expect(result).a('array').length(1);

    // Verify
    await verifyOne(router_req.body[0].name, result[0]);
});

test('update multiple records', async () => {
    let router = new RouterTest();

    // Create the records
    let create = await kernel.data.createAll(ObjectType.Test, [
        { name: 'foo-0' },
        { name: 'foo-1' },
        { name: 'foo-2' },
    ]);

    // Verify
    await verifyOne('foo-0', create[0]);
    await verifyOne('foo-1', create[1]);
    await verifyOne('foo-2', create[2]);

    // Build the structures
    let router_req = createRouterReq([
        { id: create[0].data.id, name: 'foo-0-updated' },
        { id: create[0].data.id, name: 'foo-1-updated' },
        { id: create[0].data.id, name: 'foo-2-updated' },
    ]);

    let router_res = createRouterRes();

    // Run the router
    let result = await router.runsafe(kernel, router_req, router_res);

    chai.expect(result).a('array').length(3);

    // Verify
    await verifyOne(router_req.body[0].name, result[0]);
    await verifyOne(router_req.body[1].name, result[1]);
    await verifyOne(router_req.body[2].name, result[2]);
});

test('update record with missing data', async () => {
    let router = new RouterTest();

    // Build the structures
    let router_req = createRouterReq([
        { id: '1', name: null, integer: null, decimal: 2.0, boolean: false },
    ]);

    let router_res = createRouterRes();

    // Run the router
    try {
        let result = await router.runsafe(kernel, router_req, router_res);
    } catch (error) {
        chai.expect(error).to.be.instanceOf(Error);
        chai.expect(error.message).to.include('E_DATA_REQUIRED');
    }
});

test('update record with bad integer', async () => {
    let router = new RouterTest();

    // Build the structures
    let router_req = createRouterReq([
        { id: '1', name: 'foo', integer: 'bad', decimal: 2.0, boolean: false },
    ]);

    let router_res = createRouterRes();

    // Run the router
    try {
        let result = await router.runsafe(kernel, router_req, router_res);
    } catch (error) {
        chai.expect(error).to.be.instanceOf(Error);
        chai.expect(error.message).to.include('invalid input syntax for type integer');
    }
});

test('update record with missing name', async () => {
    let router = new RouterTest();

    // Build the structures
    let router_req = createRouterReq([
        { id: '1', name: undefined, integer: 1, decimal: 2.0, boolean: false },
    ]);

    let router_res = createRouterRes();

    // Run the router
    try {
        let result = await router.runsafe(kernel, router_req, router_res);
    } catch (error) {
        chai.expect(error).to.be.instanceOf(Error);
        chai.expect(error.message).to.include('E_DATA_REQUIRED');
    }
});

test('update record with object instead of array', async () => {
    let router = new RouterTest();

    // Build the structures
    let router_req = createRouterReq(
        { id: '1', name: 'foo', integer: 1, decimal: 2.0, boolean: false }
    );

    let router_res = createRouterRes();

    // Run the router
    try {
        let result = await router.runsafe(kernel, router_req, router_res);
    } catch (error) {
        chai.expect(error).to.be.instanceOf(Error);
        chai.expect(error.message).to.include('to be an array');
    }
});
