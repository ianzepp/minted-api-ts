import _ from "lodash";
import chai from 'chai';

import { Kernel } from "@system/kernels/kernel";
import { Router } from "./router";

export interface RouteTest {
    method: string;
    router: string;
    body?: any;
}

export class Tester extends Kernel {
    public static randomName() {
        return _.snakeCase('test.' + Math.random());
    }

    public static toRandomRecord() {
        return { name: Tester.randomName() };
    }

    public static toRandomRecordList() {
        return [this.toRandomRecord(), this.toRandomRecord()];
    }

    //
    // Helper methods for routing
    //

    static async testRouter(method: string, router: string, body?: any) {
        let headers = {};
    
        if (body && typeof body === 'object') {
            body = JSON.stringify(body);
        }
    
        if (method !== 'GET') {
            headers['content-type'] = 'application/json';
        }
    
        // Build the request
        let req = new Request(`http://localhost/api/${ router }`, {
            method: method,
            body: body,
            headers: headers,
        });
    
        // Send it to the kernel for routing
        let res = await Router.route(req);
    
        // Check the result
        chai.expect(res).instanceOf(Response);
        chai.expect(res).property('status', 200);
        chai.expect(res.headers.get('content-type')).eq('application/json');
    
        return res.json();
    }
    
    static async expectResult(method: string, router: string, body?: any) {
        let res = await Tester.testRouter(method, router, body);
    
        if (res && res.errors instanceof Array) {
            _.each(res.errors, error => console.error(error));
        }

        // Check the result
        chai.expect(res).a('object')
        chai.expect(res).property('status', 'ok');
        chai.expect(res).property('result');
        chai.expect(res).not.property('errors');
    
        return res.result;
    }
    
    static async expectErrors(method: string, router: string, body?: any) {
        let res = await Tester.testRouter(method, router, body);
    
        if (res && res.result) {
            console.error(res.result);
        }

        // Check the result
        chai.expect(res).a('object')
        chai.expect(res).property('status', 'errors');
        chai.expect(res).property('errors');
        chai.expect(res).not.property('result');
    
        return res.errors;
    }
}