import _, { replace } from 'lodash';
import chai from 'chai';

// Classes
import { Tester } from '@system/classes/tester';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

test('POST "data/system::test" without data returns error', async () => {
    let errors = await Tester.expectErrors('POST', 'data/system::test');

    chai.expect(errors).a('array').not.empty;
    chai.expect(errors[0]).includes('Unexpected end of JSON input');
});

test('POST "data/system::test" with an empty array returns error', async () => {
    let errors = await Tester.expectErrors('POST', 'data/system::test', []);

    chai.expect(errors).a('array').not.empty;
    chai.expect(errors[0]).includes('Request body is empty');
});

test('POST "data/system::test" with an array of records returns ok', async () => {
    let result = await Tester.expectResult('POST', 'data/system::test', [
        { name: 'post-data-1' },
        { name: 'post-data-2' },
        { name: 'post-data-3' },
    ]);

    chai.expect(result).a('array').length(3);
    chai.expect(_.compact(_.map(result, 'data.id'))).a('array').length(3);
});

test('POST "data/system::test" with an empty object returns error', async () => {
    let errors = await Tester.expectErrors('POST', 'data/system::test', {});

    chai.expect(errors).a('array').not.empty;
    chai.expect(errors[0]).includes('Request body is empty');
});

test('POST "data/system::test" with a single record (type RecordFlat) returns ok', async () => {
    let result = await Tester.expectResult('POST', 'data/system::test', { 
        name: 'post-data-1' 
    });

    chai.expect(result).a('object');
    chai.expect(result).nested.property('type', 'system::test');
    chai.expect(result).nested.property('data.id');
    chai.expect(result).nested.property('data.name', 'post-data-1');
});

test('POST "data/system::test" with a single record (type RecordJson) returns ok', async () => {
    let result = await Tester.expectResult('POST', 'data/system::test', { 
        type: 'system::test',
        data: {
            name: 'post-data-1' 
        }
    });

    chai.expect(result).a('object');
    chai.expect(result).nested.property('type', 'system::test');
    chai.expect(result).nested.property('data.id');
    chai.expect(result).nested.property('data.name', 'post-data-1');
});

