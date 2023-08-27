import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Subsystems
import { SystemData } from '../classes/system-data';
import { SystemMeta } from '../classes/system-meta';
import { SystemKnex } from '../classes/system-knex';

export class System {
    static UUIDZERO = '00000000-0000-0000-0000-000000000000';

    // Services
    public readonly data = new SystemData(this);
    public readonly meta = new SystemMeta(this);
    public readonly knex = new SystemKnex(this);

    // System contants
    public readonly NOW = new Date();

    // Setup the user-specific system, or default to a root user.
    constructor(readonly options: _.Dictionary<any> = {}) {}

    /** Startup the system */
    async startup() {
        await this.data.startup();
        await this.meta.startup();
        await this.knex.startup();
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
        return this.NOW.toISOString();
    }
}