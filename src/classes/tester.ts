import _ from 'lodash';

// Classes
import { Kernel } from "@classes/kernel";
import { SchemaType } from "@layouts/schema";

export class Tester extends Kernel {
    public static ID = '99999999-9999-4999-9999-999999999999'; // v4 UUID
    public static NS = 'test';

    constructor() {
        super(Tester.ID, Tester.NS);
    }

    //
    // Kernel Methods
    //

    async startup() {
        await super.startup();
        await this.knex.transaction();
    }

    async cleanup() {
        await this.knex.rollback();
        await super.cleanup();
    }

    isTest(): boolean {
        return true;
    }

    //
    // New Methods
    //

    async createTestTable()  {
        let record = await this.data.createOne(SchemaType.Schema, { 
            schema_name: this.toTestSchemaName()
        });

        return this.meta.schemas.get(record.data.schema_name);
    }

    toTestSchemaName() {
        return 'test.' + this.toTestName();
    }

    toTestName() {
        return 'test_' + Math.floor(Math.random() * 1000000);
    }
}
