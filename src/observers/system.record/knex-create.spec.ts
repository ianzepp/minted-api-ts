import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Column } from '../../classes/column';
import { Record } from '../../classes/record';
import { Schema } from '../../classes/schema';
import { System } from '../../classes/system';
import { SystemAsTest } from '../../classes/system';
import { RecordColumnRequiredError } from '../../classes/errors';

describe(__filename, () => {
    test('system.data.createAll(): adds data to the database', async () => {
        await new SystemAsTest().run(async system => {
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
    });

    test('system.data.createOne(): adds data to the database', async () => {
        await new SystemAsTest().run(async system => {
            let record = await system.data.createOne('test', { name: 'knex-create.spec' });

            chai.expect(record).instanceOf(Record);
            chai.expect(record.data).property('id').string;
            chai.expect(record.data).property('name', 'knex-create.spec');
        });
    });
}); 