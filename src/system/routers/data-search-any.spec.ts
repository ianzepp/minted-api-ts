import _, { replace } from 'lodash';
import chai from 'chai';

// Classes
import { Tester } from '@system/classes/tester';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";
test('GET "data/whoops::test" returns error', async () => {
    let errors = await Tester.expectErrors('GET', 'data/whoops::test');
    chai.expect(errors).a('array').not.empty;
    chai.expect(errors[0]).includes('not found or is not visible');
});

test('GET "data/system::test" returns ok with records', async () => {
    let result = await Tester.expectResult('GET', 'data/system::test');
    chai.expect(result).a('array').not.empty;
});

