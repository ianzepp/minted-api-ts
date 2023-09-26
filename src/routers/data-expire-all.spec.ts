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
import RouterTest from '@routers/data-expire-all';

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

function createRouterReq(body: any): RouterReq {
    return {
        verb: 'DELETE',
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

async function verifyOne(result: any) {
    let record = toJSON(result);

    chai.expect(record).a('object');
    chai.expect(record).nested.property('data.id').string;
    chai.expect(record).nested.property('meta.expired_at').string;
    chai.expect(record).nested.property('meta.expired_by').string;
    chai.expect(record).nested.property('meta.deleted_at').null;
    chai.expect(record).nested.property('meta.deleted_by').null;

    // Confirm the record cannot be selected anymore
    let select = await kernel.data.selectIds(SchemaType.Test, [record.data.id]);

    chai.expect(select).a('array').length(0);
}

test('expire multiple records', async () => {
    let router = new RouterTest();
    let schema_name = SchemaType.Test;

    // Create the data
    let create = await kernel.data.createAll(schema_name, [
        { name: 'foo-0' },
        { name: 'foo-1' },
        { name: 'foo-2' },
    ]);

    chai.expect(create).a('array').length(3);

    // Build the structures
    let router_req = createRouterReq(create);
    let router_res = createRouterRes();

    // Run the router
    let result = await router.runsafe(kernel, router_req, router_res);

    chai.expect(result).a('array').length(3);

    // Verify
    await verifyOne(result[0]);
    await verifyOne(result[1]);
    await verifyOne(result[2]);
});

test('expire with object instead of array', async () => {
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
