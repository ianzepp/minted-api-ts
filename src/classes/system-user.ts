import _ from 'lodash';

// Classes
import { System } from '../classes/system';
import { SystemService } from '../classes/system';

// User API errors
export class UserError extends Error {};
export class UserNotFoundError extends UserError {};
export class UserClientNotActiveError extends UserError {};

export class SystemUser implements SystemService {
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

    async authenticate(): Promise<void> {
        // The knex transaction isn't setup yet, so access the DB directly
        let user = await this.system.knex.db(`system_data.user as data`)
            .where('data.id', this.system.user_id)
            .where('data.ns', this.system.user_ns)
            .first();

        if (user === undefined) {
            throw new UserNotFoundError(this.system.user_id);
        }
    }

    async startup(): Promise<void> {}

    async cleanup(): Promise<void> {}
}