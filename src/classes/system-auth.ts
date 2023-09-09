import _ from 'lodash';

// Classes
import { System } from './system';
import { SystemService } from './system';

// User API errors
export class AuthError extends Error {};
export class AuthUserNotFoundError extends AuthError {};
export class AuthClientNotFoundError extends AuthError {};

export class SystemAuth implements SystemService {
    get id() {
        return this.system.user_id;
    }

    get ns() {
        return this.system.user_ns;
    }

    get namespaces() {
        return _.uniq(_.compact(['system', this.ns]));
    }

    constructor(private readonly system: System) {}

    async startup(): Promise<void> {}

    async cleanup(): Promise<void> {}

    async authenticate(): Promise<void> {
        // The knex transaction isn't setup yet, so access the DB directly
        let user = await this.system.knex.db(`system_data.user as data`)
            .where('data.id', this.system.user_id)
            .where('data.ns', this.system.user_ns)
            .first();

        if (user === undefined) {
            throw new AuthUserNotFoundError(this.system.user_id);
        }
    }

}