import _, { replace } from 'lodash';
import chai from 'chai';

// Classes
import { Tester } from '@system/classes/tester';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

test('POST "find/system::test" returns ok with records', async () => {
    let result = await Tester.expectResult('POST', 'find/system::test', {
        where: {
            integer: {
                $eq: 100
            }
        },

        order: {
            decimal: 'asc'
        }
    });

    chai.expect(result).a('array').length(1);
});

