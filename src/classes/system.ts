import _ from 'lodash';

// Classes
import { SystemRoot } from '../classes/system-root';

// Layouts
import { SystemUser } from '../layouts/system';

// Subsystems
import { SystemData } from '../classes/system-data';
import { SystemMeta } from '../classes/system-meta';
import { SystemKnex } from '../classes/system-knex';
import { SystemHttp } from '../classes/system-http';


export class System {
    // Services
    public readonly data = new SystemData(this);
    public readonly meta = new SystemMeta();
    public readonly knex = new SystemKnex();
    public readonly http = new SystemHttp();

    // System constants
    public readonly timestamp = new Date().toISOString();

    // Root or not?
    public readonly is_root: boolean;

    // Setup the user-specific system, or default to a root user.
    constructor(readonly user: SystemUser = new SystemRoot) {
        this.is_root = user.id == SystemRoot.UUID;
    }

    get namespaces() {
        return _.uniq(_.compact(['system', this.user.ns, ... this.user.scopes ?? []]));
    }

    /** Startup the system */
    async startup(): Promise<this> {
        await this.data.startup();
        await this.meta.startup();
        await this.knex.startup();
        await this.http.startup();

        // Done
        return this;
    }
}


