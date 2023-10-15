import _, { replace } from 'lodash';
import chai from 'chai';

// Classes
import { Kernel } from '@system/kernels/kernel';
import { Testing } from '@system/classes/testing';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

let kernel = new Kernel();

beforeEach(async () => {
    await kernel.startup();
});

afterEach(async () => {
    await kernel.cleanup();
});

test('create-all', async () => {
    // let create_list = Testing.toRandomRecordList();
    // let result_list = await Testing.route({
    //     method: 'POST', 
    //     router: 'data/test', 
    //     body: create_list
    // });

    // chai.expect(result_list).a('array').length(create_list.length);
});
