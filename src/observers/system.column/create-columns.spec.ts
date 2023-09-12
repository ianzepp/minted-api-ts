import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// Bun:test
import { beforeEach, afterEach, describe, test } from "bun:test";

// Classes
import { SchemaType } from '@classes/schema-type';
import { System } from '@classes/system';
import { SystemAsTest } from '@classes/system';

let system = new SystemAsTest();
let source_data = { 
    schema_name: SchemaType.ClientUser, 
    column_name: 'something', 
    column_type: 'text' 
};

beforeEach(async () => {
    await system.startup();
});

afterEach(async () => {
    await system.cleanup();
});

test('should create a knex column', async () => {
    await system.data.createOne(SchemaType.Column, source_data);

    // Make sure we can insert records
    await system.data.createOne(SchemaType.ClientUser, {
        name: 'username',
        something: 'this is some type of value'
    });

    // Check using direct knex
    let select = await system.knex.driverTo(SchemaType.ClientUser).select().first();

    chai.expect(select).a('object');
    chai.expect(select).property('id').string;
    chai.expect(select).property('something');
});

