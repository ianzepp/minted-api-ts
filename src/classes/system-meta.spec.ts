import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Classes
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { System } from '../classes/system';

describe('SystemMeta', () => {
    let system: System;

    beforeAll(async () => {
        system = await new System({ id: uuid(), ns: 'test', scopes: null }).startup();
    });

    afterAll(async () => {
        return system.knex.destroy();
    });

    test('schema => database table lifecycle', async () => {
        let record_name = "test_" + new Date().getTime();
        let record_schema = system.meta.schemas.schema;
        let record = record_schema.toRecord({ schema_name: record_name, schema_type: 'database' });

        // Insert the new schema record
        record = await system.data.createOne(record_schema, record);

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns', system.user.ns);
        chai.expect(record.meta).property('created_at');
        chai.expect(record.meta).property('created_by', system.user.id);
        chai.expect(record.meta).property('expired_at').null;
        chai.expect(record.meta).property('expired_by').null;

        // Refresh the system
        await system.meta.refresh();

        // We should have the test schema available
        let tested_schema = system.meta.schemas[record_name];
        let tested = await system.data.createOne(tested_schema, {});

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns', system.user.ns);
        chai.expect(record.meta).property('created_at').not.null;
        chai.expect(record.meta).property('created_by', system.user.id);
        chai.expect(record.meta).property('expired_at').null;
        chai.expect(record.meta).property('expired_by').null;
        chai.expect(record.meta).property('deleted_at').null;
        chai.expect(record.meta).property('deleted_by').null;

        // Expire the schema record.
        record = await system.data.expireOne(record_schema, record);

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns', system.user.ns);
        chai.expect(record.meta).property('created_at').not.null;
        chai.expect(record.meta).property('created_by', system.user.id);
        chai.expect(record.meta).property('expired_at').not.null;
        chai.expect(record.meta).property('expired_by', system.user.id);
        chai.expect(record.meta).property('deleted_at').null;
        chai.expect(record.meta).property('deleted_by').null;

        // Table operations should still work..
        await system.data.selectAny(tested_schema, {});

        // Expire the schema record.
        record = await system.data.deleteOne(record_schema, record);

        chai.expect(record).instanceOf(Record);
        chai.expect(record).property('data').a('object');
        chai.expect(record.data).property('id').string;
        chai.expect(record.data).property('ns', system.user.ns);
        chai.expect(record.meta).property('created_at').not.null;
        chai.expect(record.meta).property('created_by', system.user.id);
        chai.expect(record.meta).property('expired_at').not.null;
        chai.expect(record.meta).property('expired_by', system.user.id);
        chai.expect(record.meta).property('deleted_at').not.null;
        chai.expect(record.meta).property('deleted_by', system.user.id);

        // Table should be deleted, so we shouldn't be able to get data
        try {
            await system.data.selectAny(tested_schema, {});
        }

        catch (error) {
            chai.expect(error).property('message').match(/relation ".+?" does not exist/);
        }

        // Refresh the system
        await system.meta.refresh();

        // Test schema should be gone
        chai.expect(system.meta.schemas).not.property(record_name);
    });
});
