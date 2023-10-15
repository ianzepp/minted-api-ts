import _ from 'lodash';
import chai from 'chai';

// Imports
import { Kernel } from '@system/kernels/kernel';

export interface TestingRoute {
    method: string;
    router: string;
    body?: any;
}

export class Testing {
    static randomName() {
        return _.snakeCase('test.' + Math.random());
    }

    static toRandomRecord() {
        return { name: Testing.randomName() };
    }

    static toRandomRecordList() {
        return [this.toRandomRecord(), this.toRandomRecord()];
    }

    static async route({ method, router, body }: TestingRoute) {
        if (body && typeof body === 'object') {
            body = JSON.stringify(body);
        }

        // Build the request
        let req = new Request(`http://localhost/api/${ router }`, {
            method: method,
            body: body,
            headers: { 'content-type': 'application/json' }
        });

        // Send it to the kernel for routing
        let res = await new Kernel().route(req);

        // Check the result
        chai.expect(res).instanceOf(Response);
        chai.expect(res).property('status', 200);
    
        let json = await res.json();
    
        chai.expect(json).instanceOf(Object).not.empty;
        chai.expect(json).property('code', 200);
        chai.expect(json).property('body');
    
        // Done
        return json.body;
    }
}