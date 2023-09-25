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
import RouterTest from '@routers/data-delete-all';

let kernel = new Tester();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

async function verifyOne(result: any) {
    let record = toJSON(result);

    chai.expect(record).a('object');
    chai.expect(record).nested.property('data.id').string;
    chai.expect(record).nested.property('meta.deleted_at').string;
    chai.expect(record).nested.property('meta.deleted_by').string;

    // Confirm the record cannot be selected anymore
    let select = await kernel.data.selectIds(SchemaType.Test, [record.data.id]);

    chai.expect(record).a('array').length(0);
}

test('delete multiple records', async () => {
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
    let router_req: RouterReq = {
        verb: 'DELETE',
        path: '/api/data/' + schema_name,
        params: { schema: schema_name },
        search: {},
        body: create
    };

    let router_res: RouterRes = {
        status: 0,
        length: 0,
        schema: undefined,
        record: undefined,
        filter: undefined,
        result: undefined,
    }

    // Run the router
    let result = await router.runsafe(kernel, router_req, router_res);

    chai.expect(result).a('array').length(3);

    // Verify
    await verifyOne(result[0]);
    await verifyOne(result[1]);
    await verifyOne(result[2]);
});

