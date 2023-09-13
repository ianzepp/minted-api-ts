import _ from 'lodash';
import util from 'util';
import chai from 'chai';
import debug from 'debug';
import { v4 as uuid } from 'uuid';

// Kernel services
import { KernelAuth } from '@classes/kernel-auth';
import { KernelData } from '@classes/kernel-data';
import { KernelMeta } from '@classes/kernel-meta';
import { KernelKnex } from '@classes/kernel-knex';

// Enums
import { SchemaType } from './schema-type';

export const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export enum KernelVerb {
    Create = 'create',
    Delete = 'delete',
    Expire = 'expire',
    Select = 'select',
    Update = 'update',
    Upsert = 'upsert',
}

export interface KernelService {
    startup(): Promise<void>;
    cleanup(): Promise<void>;
}

export class Kernel {
    public static RootId = "00000000-0000-0000-0000-000000000000";
    public static RootNs = "system";

    public static TestId = "99999999-9999-4999-9999-999999999999"; // v4 UUID
    public static TestNs = "test";

    // Enums
    public static SchemaType = SchemaType;

    // Services
    public readonly auth = new KernelAuth(this);
    public readonly data = new KernelData(this);
    public readonly meta = new KernelMeta(this);
    public readonly knex = new KernelKnex(this);

    // Error management
    public readonly expect = chai.expect;
    public readonly errors: Error[] = [];

    // Kernel constants
    public readonly time: Date = new Date(); // timestamp
    public readonly time_iso = this.time.toISOString();
    public readonly uuid = uuid;
    public readonly chai = chai;

    // Sudo root
    private sudo_chain: string[] = [];

    // Setup the user-specific kernel, or default to a root user.
    constructor(readonly user_id: string, readonly user_ns: string) {
        // Nil UUID doesn't technically meet UUID version format requirements
        if (user_id !== Kernel.RootId) {
            chai.expect(user_id).a('string').match(UUID_REGEX);
        }

        // NS should always exist
        chai.expect(user_ns).a('string').not.empty;
    }

    async authenticate() {
        await this.auth.authenticate();
    }

    async startup() {
        // Start knex first so we have a transaction context
        await this.knex.startup();

        // Remaining services
        await this.data.startup();
        await this.meta.startup();
        await this.auth.startup();
    }

    async cleanup() {
        // Shutdown services
        await this.data.cleanup();
        await this.meta.cleanup();
        await this.auth.cleanup();

        // Shutdown knex last so the transaction commits/rollbacks
        await this.knex.cleanup();
    }

    async refresh() {
        await this.cleanup();
        await this.startup();
    }

    async run(executeFn: (kernel: Kernel) => Promise<any>) {
        try {
            // Startup
            await this.authenticate();
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

    isRoot() {
        return Kernel.RootId === this.user_id 
            || Kernel.RootId === _.last(this.sudo_chain);
    }

    isTest() {
        return this instanceof KernelAsTest;
    } 

    isProd() {
        return Bun.env.NODE_ENV === 'production';
    } 

    //
    // Root sudo contest
    //

    sudoRoot() {
        this.sudo_chain.push(Kernel.RootId);
    }

    sudoExit() {
        this.sudo_chain.pop();
    }
}

export class KernelAsRoot extends Kernel {
    constructor() {
        super(Kernel.RootId, Kernel.RootNs);
    }
}

export class KernelAsTest extends Kernel {
    constructor() {
        super(Kernel.TestId, Kernel.TestNs);
    }

    async startup() {
        await super.startup();
        await this.knex.transaction();
    }

    async cleanup() {
        await this.knex.rollback();
        await super.cleanup();
    }

    toTestSchemaName() {
        return 'test.' + this.toTestName();
    }

    toTestName() {
        return 'test_' + Math.floor(Math.random() * 1000000);
    }

    async createTestTable()  {
        let record = await this.data.createOne(SchemaType.Schema, { 
            schema_name: this.toTestSchemaName()
        });

        return this.meta.schemas.get(record.data.schema_name);
    }
}

// TODO process cors data
export class KernelAsCors extends Kernel {
    constructor(cookie?: string) {
        let user_id = Kernel.TestId;
        let user_ns = Kernel.TestNs;

        super(user_id, user_ns);
    }
}
