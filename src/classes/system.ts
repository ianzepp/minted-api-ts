import _ from 'lodash';

// Subsystems
import { SystemData } from '../classes/system-data';
import { SystemMeta } from '../classes/system-meta';
import { SystemKnex } from '../classes/system-knex';
import { SystemHttp } from '../classes/system-http';

export interface SystemUser {
    // The UUID of the running user, or the System.RootId if the running user is root
    id: string;

    // The Namespace of the running user. Used when creating new records and for visibility
    ns: string;

    // Any extra namespace visibility scopes to apply. Defaults to null
    scopes: string[] | null;
}

export class System {
    public static RootId = "00000000-0000-0000-0000-000000000000";

    // Services
    public readonly data = new SystemData(this);
    public readonly meta = new SystemMeta(this);
    public readonly knex = new SystemKnex(this);
    public readonly http = new SystemHttp(this);

    // System constants
    public readonly timestamp = new Date().toISOString();

    // Root or not?
    public readonly is_root: boolean;
    public readonly is_user: boolean;

    // Setup the user-specific system, or default to a root user.
    constructor(readonly user: SystemUser) {
        this.is_root = user.id == System.RootId;
        this.is_user = user.id != System.RootId;
    }

    /** Startup the system */
    async startup(): Promise<void> {
        await this.data.startup();
        await this.meta.startup();
        await this.knex.startup();
        await this.http.startup();
    }
}


