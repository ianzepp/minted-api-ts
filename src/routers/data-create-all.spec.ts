import _ from 'lodash';
import chai from 'chai';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Tester } from '@classes/tester';
import { SchemaType } from '@typedefs/schema';
import { RouterReq } from '@typedefs/router-req';
import { RouterRes } from '@typedefs/router-res';
import { toJSON } from '@classes/helpers';

// Router for testing
import RouterTest from '@routers/data-create-all';

let kernel = new Tester();

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

    // Confirm the record exists in the system
    let select = await kernel.data.select404(SchemaType.Test, record.data.id);

    chai.expect(record).a('object');
    chai.expect(record).nested.property('data.id', record.data.id).string;
    chai.expect(record).nested.property('data.name', record.data.name);
    chai.expect(record).nested.property('meta.created_at', record.meta.created_at);
    chai.expect(record).nested.property('meta.created_by', record.meta.created_by);
}

function createRouterReq(body: any): RouterReq {
    return {
        verb: 'POST',
        path: '/api/data/' + SchemaType.Test,
        params: { schema: SchemaType.Test },
        search: {},
        body: body
    };
}

function createRouterRes(): RouterRes {
    return {
        status: 0,
        length: 0,
        schema: undefined,
        record: undefined,
        filter: undefined,
        result: undefined,
    };
}

test('create one record', async () => {
    let router = new RouterTest();

    // Build the structures
    let router_req = createRouterReq([
        { name: 'foo', integer: null, decimal: 2.0, boolean: false },
    ]);

    let router_res = createRouterRes();

    // Run the router
    let result = await router.runsafe(kernel, router_req, router_res);

    chai.expect(result).a('array').length(1);

    // Verify
    await verifyOne(router_req.body[0].name, result[0]);
});

test('create multiple records', async () => {
    let router = new RouterTest();

    // Build the structures
    let router_req = createRouterReq([
        { name: 'foo-0' },
        { name: 'foo-1' },
        { name: 'foo-2' },
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

test('create record with missing data', async () => {
    let router = new RouterTest();

    // Build the structures
    let router_req = createRouterReq([
        { name: null, integer: null, decimal: 2.0, boolean: false },
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

test('create record with bad integer', async () => {
    let router = new RouterTest();

    // Build the structures
    let router_req = createRouterReq([
        { name: 'foo', integer: 'bad', decimal: 2.0, boolean: false },
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

test('create record with missing name', async () => {
    let router = new RouterTest();

    // Build the structures
    let router_req = createRouterReq([
        { name: undefined, integer: 1, decimal: 2.0, boolean: false },
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

test('create record with object instead of array', async () => {
    let router = new RouterTest();

    // Build the structures
    let router_req = createRouterReq(
        { name: 'foo', integer: 1, decimal: 2.0, boolean: false }
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

