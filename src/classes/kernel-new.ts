/*import _ from 'lodash';
import util from 'util';
import chai from 'chai';
import debug from 'debug';
import { v4 as uuid } from 'uuid';

// Classes
import { KernelAuth } from '@classes/kernel-auth';
import { KernelData } from '@classes/kernel-data';
import { KernelMeta } from '@classes/kernel-meta';
import { KernelKnex } from '@classes/kernel-knex';

// Layouts
import { Service } from "@layouts/system";
import { SystemVerb } from "@layouts/system";
import { SchemaType } from '@layouts/schema';


export const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export class Kernel implements Service {
    // General
    public static ID = '00000000-0000-0000-0000-000000000000';
    public static NS = 'system';

    // Re-export aliases
    public static Chai = chai;
    public static Verb = SystemVerb;
    public static Type = SchemaType;
    public static UUID = uuid;

    // Services
    public readonly auth = new KernelAuth(this);
    public readonly data = new KernelData(this);
    public readonly meta = new KernelMeta(this);
    public readonly knex = new KernelKnex(this);

    // Error management
    public readonly expect = chai.expect;
    public readonly errors: Error[] = [];

    // Kernel constants
    public readonly time = new Date();

    // Sudo root
    private sudo_chain: string[] = [];

    // Setup the user-specific kernel, or default to a root user.
    constructor(readonly user_id: string, readonly user_ns: string) {
        // Nil UUID doesn't technically meet UUID version format requirements
        if (user_id !== Kernel.ID) {
            chai.expect(user_id).a('string').match(UUID_REGEX);
        }

        // NS should always exist
        chai.expect(user_ns).a('string').not.empty;
    }

    //
    // Service Methods
    //

    async startup(): Promise<void> {
        // Start knex first so we have a transaction context
        await this.knex.startup();

        // Remaining services
        await this.data.startup();
        await this.meta.startup();
        await this.auth.startup();
    }

    async cleanup(): Promise<void> {
        // Shutdown services
        await this.data.cleanup();
        await this.meta.cleanup();
        await this.auth.cleanup();

        // Shutdown knex last so the transaction commits/rollbacks
        await this.knex.cleanup();
    }

    async refresh(): Promise<void> {
        await this.cleanup();
        await this.startup();
    }

    async certify(): Promise<void> {
        await this.auth.authenticate();
    }

    //
    // Methods
    //

    async run(executeFn: (kernel: Kernel) => Promise<any>) {
        try {
            // Startup
            await this.certify();
            await this.startup();
            
            // Run the logic
            await executeFn(this);
        }
        
        finally {
            await this.cleanup();
        }
    }

    emit(cn, fn, ... messages) {
        debug(cn + ':' + fn)(util.format(... messages));
    }

    isRoot(): boolean {
        return Kernel.ID === this.user_id || Kernel.ID === _.last(this.sudo_chain);
    }

    isTest(): boolean {
        return false;
    } 

    isProd(): boolean {
        return Bun.env.NODE_ENV === 'production';
    }

    timeISO(): string {
        return this.time.toISOString();
    }

    //
    // Root sudo contest
    //

    sudoRoot() {
        this.sudo_chain.push(Kernel.ID);
    }

    sudoExit() {
        this.sudo_chain.pop();
    }
}

export class Tester extends Kernel {
    public static ID = '99999999-9999-4999-9999-999999999999'; // v4 UUID
    public static NS = 'test';

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
*/