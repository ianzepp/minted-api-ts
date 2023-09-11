import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { Record } from '../../classes/record';
import { SystemAsTest } from '../../classes/system';

describe('knex-create', () => {
    let system = new SystemAsTest();

    beforeEach(async () => {
        await system.startup();
    });

    afterEach(async () => {
        await system.cleanup();
    });

    test('system.data.createAll(): adds data to the database', async () => {
        let record_list = await system.data.createAll('test', [
            { name: 'knex-create.spec.0' },
            { name: 'knex-create.spec.1' },
        ]);

        chai.expect(record_list).an('array').length(2);

        for(let i in record_list) {
            let record = record_list[i];

            chai.expect(record).instanceOf(Record);
            chai.expect(record.data).property('id').string;
            chai.expect(record.data).property('name', 'knex-create.spec.' + i);
        }
    });

    test('system.data.createOne(): adds data to the database', async () => {
        let record = await system.data.createOne('test', { name: 'knex-create.spec' });

        chai.expect(record).instanceOf(Record);
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('name', 'knex-create.spec');
    });
}); 