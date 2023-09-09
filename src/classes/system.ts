import _ from 'lodash';
import chai from 'chai';

// System services
import { SystemUser } from '../classes/system-user';
import { SystemData } from '../classes/system-data';
import { SystemMeta } from '../classes/system-meta';
import { SystemKnex } from '../classes/system-knex';
import { SystemHttp } from '../classes/system-http';

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

    // Services
    public readonly user = new SystemUser(this);
    public readonly data = new SystemData(this);
    public readonly meta = new SystemMeta(this);
    public readonly knex = new SystemKnex(this);
    public readonly http = new SystemHttp(this);

    // Error management
    public readonly expect = chai.expect;
    public readonly errors: Error[] = [];

    // System constants
    public readonly timestamp = new Date().toISOString();

    // Setup the user-specific system, or default to a root user.
    constructor(readonly user_id: string, readonly user_ns: string) {
        if (user_id === System.RootId) {
            return; // Root can be placed into any NS
        }

        chai.expect(user_id).a('string').match(UUID_REGEX);
        chai.expect(user_ns).a('string').not.empty;
    }

    async authenticate(): Promise<this> {
        await this.user.authenticate();

        // Done;
        return this;
    }

    async startup(): Promise<this> {
        await this.data.startup();
        await this.meta.startup();
        await this.knex.startup();
        await this.http.startup();
        await this.user.startup();

        // Done
        return this;
    }

    async cleanup(): Promise<this> {
        await this.data.cleanup();
        await this.meta.cleanup();
        await this.knex.cleanup();
        await this.http.cleanup();
        await this.user.cleanup();

        // Done
        return this;
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
}

// TODO process cors data
export class SystemAsCors extends System {
    constructor(cookie?: string) {
        let user_id = System.TestId;
        let user_ns = System.TestNs;

        super(user_id, user_ns);
    }
}
