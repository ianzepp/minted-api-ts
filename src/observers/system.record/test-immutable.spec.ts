import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { SystemAsTest } from '@classes/system';
import { RecordColumnImmutableError } from '@classes/system-data';

describe(__filename, () => {
    let schema_name = 'test_' + process.hrtime().join('_');
    let column_name = 'test_immutable';

    test('immutable column should throw an error', async () => {
        return new SystemAsTest().run(async system => {
            let schema = await system.data.createOne('schema', {
                schema_name: schema_name,
                schema_type: 'database',
            });

            let column = await system.data.createOne('column', {
                schema_name: schema_name,
                column_name: column_name,
                column_type: 'text',
                immutable: true
            });

            // Should be able to create a record
            let record = await system.data.createOne(schema_name, {
                test_immutable: 'some value'
            });

            // Should not be able to change the value
            try {
                record.data.test_immutable = 'changed value';
                record = await system.data.updateOne(schema_name, record);

                // Did not throw yet
                throw new Error('Test case failed');
            }

            catch (error) {
                if (error instanceof RecordColumnImmutableError) {
                    return; // test passes
                }

                throw error;
            }
        });
    });
});