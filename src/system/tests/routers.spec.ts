import _ from 'lodash';
import chai from 'chai';

// Classes
import { Kernel } from '@system/kernels/kernel';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

function toRequest(method: string, object: string = 'system::test', record?: string, body?: any) {
    let path = 'http://localhost:9999/api/data';
    let headers = {};

    if (object) {
        path += '/' + object;
    }

    if (object && record) {
        path += '/' + record;
    }

    // Body data
    if (body === undefined) {
        // nothing to set
    }

    else if (typeof body === 'string') {
        headers['Content-Type'] = 'text/plain';
    }

    else if (typeof body === 'object') {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    }

    else if (body instanceof Array) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    }

    // Done
    return new Request(path, { method, body, headers });
}

test('data-select-any', async () => {
    let req = toRequest('GET', 'system::object');
    let res = await new Kernel().route(req);

    chai.expect(res).instanceOf(Response);
    chai.expect(res).property('status', 200);

    let json = await res.json();

    console.warn(json);
});

