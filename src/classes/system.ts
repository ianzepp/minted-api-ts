import _ from 'lodash';
import chai from 'chai';
import { v4 as uuid } from 'uuid';

// System services
import { SystemAuth } from '@classes/system-auth';
import { SystemData } from '@classes/system-data';
import { SystemMeta } from '@classes/system-meta';
import { SystemKnex } from '@classes/system-knex';

// Enums
import { SchemaType } from './schema-type';

export const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export interface SystemService {
    startup(): Promise<void>;
    cleanup(): Promise<void>;
}

export class System {
    public static RootId = "00000000-0000-0000-0000-000000000000";
    public static RootNs = "system";

    public static TestId = "99999999-9999-4999-9999-999999999999"; // v4 UUID
    public static TestNs = "test";

    // Enums
    public static SchemaType = SchemaType;

    // Services
    public readonly auth = new SystemAuth(this);
    public readonly data = new SystemData(this);
    public readonly meta = new SystemMeta(this);
    public readonly knex = new SystemKnex(this);

    // Error management
    public readonly expect = chai.expect;
    public readonly errors: Error[] = [];

    // System constants
    public readonly time: Date = new Date(); // timestamp
    public readonly time_iso = this.time.toISOString();
    public readonly uuid = uuid;
    public readonly chai = chai;

    // Setup the user-specific system, or default to a root user.
    constructor(readonly user_id: string, readonly user_ns: string) {
        if (user_id === System.RootId) {
            return; // Root can be placed into any NS
        }

        chai.expect(user_id).a('string').match(UUID_REGEX);
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

    async run(executeFn: (system: System) => Promise<any>) {
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

    isRoot() {
        return System.RootId === this.user_id;
    }

    isTest() {
        return this instanceof SystemAsTest;
    } 

    isProd() {
        return Bun.env.NODE_ENV === 'production';
    } 
}

export class SystemAsRoot extends System {
    constructor() {
        super(System.RootId, System.RootNs);
    }
}

export class SystemAsTest extends System {
    constructor() {
        super(System.TestId, System.TestNs);
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
}

// TODO process cors data
export class SystemAsCors extends System {
    constructor(cookie?: string) {
        let user_id = System.TestId;
        let user_ns = System.TestNs;

        super(user_id, user_ns);
    }
}
