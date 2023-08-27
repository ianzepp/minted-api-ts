import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Subsystems
import { SystemData } from '../classes/system-data';
import { SystemMeta } from '../classes/system-meta';
import { SystemKnex } from '../classes/system-knex';

export interface SystemUser {
    id: string;
    ns: string[] | null;
    sc: string[] | null;
}

export class System {
    static UUIDZERO = '00000000-0000-0000-0000-000000000000';

    // Services
    public readonly data = new SystemData(this);
    public readonly meta = new SystemMeta(this);
    public readonly knex = new SystemKnex(this);

    // System constants
    public readonly timestamp = new Date().toISOString();

    // Setup the user-specific system, or default to a root user.
    constructor(readonly user: SystemUser) {
        console.warn('System: id=%j ns=%j sc=%j', user.id, user.ns, user.sc);
    }

    /** Startup the system */
    async startup() {
        await this.data.startup();
        await this.meta.startup();
        await this.knex.startup();
    }

    /** Authenticate a request */
    async authenticate() {
        if (this.user.id === System.UUIDZERO) {
            return;
        }

        // TODO
    }
}