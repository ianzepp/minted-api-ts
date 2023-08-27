import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Subsystems
import { SystemData } from '../classes/system-data';
import { SystemMeta } from '../classes/system-meta';

// import { BulkSystem } from '../classes/bulk-system';
// import { KnexSystem } from '../classes/knex-system';
// import { LogsSystem } from '../classes/logs-system';
// import { MetaSystem } from '../classes/meta-system';
// import { UserSystem } from '../classes/user-system';

// Default system startup options
export const SYSTEM_OPTIONS = {
    development: {
        user_id: '00000000-0000-0000-0000-000000000000',
        database: {
            driver: 'sqlite3',
            filename: 'database.db'
        }
    }
}

export class System {
    static UUIDZERO = '00000000-0000-0000-0000-000000000000';
    static NOW = new Date();

    // Services
    public readonly data = new SystemData(this);
    public readonly meta = new SystemMeta(this);

    // public readonly bulk = new BulkSystem(this);
    // public readonly logs = new LogsSystem(this);
    // public readonly knex = new KnexSystem(this);
    // public readonly meta = new MetaSystem(this);
    // public readonly user = new UserSystem(this);

    // Setup the user-specific system, or default to a root user.
    constructor(readonly options: _.Dictionary<any> = SYSTEM_OPTIONS.development) {}

    /** Startup the system */
    async startup() {
        await this.data.startup();
        await this.meta.startup();
    }

    /** Authenticate a request */
    async authenticate() {
        // await this.user.authenticate();
    }

    /** Switches to a new root context and returns a new `System` reference */
    async toRoot() {
        return new System({ user_id: System.UUIDZERO });
    }

    /** Switches to a new root context and returns a new `System` reference */
    async toUser(user_id: string) {
        return new System({ user_id: user_id });
    }

    toId(): string {
        return uuid();
    }

    now() {
        return System.NOW.toISOString();
    }
}