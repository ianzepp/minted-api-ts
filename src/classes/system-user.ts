import _ from 'lodash';
import chai from 'chai';
import fs from 'fs-extra';

// Classes
import { KnexDriver } from '../classes/knex';
import { System } from '../classes/system';
import { SystemService } from '../classes/system';

// Errors
import { UserNotFoundError } from '../classes/errors';
import { UserClientNotActiveError } from '../classes/errors';

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
        let user = await KnexDriver(`system_data.user as data`)
            .where('data.id', this.system.user_id)
            .where('data.ns', this.system.user_ns)
        .first();

        if (user === undefined) {
            throw new UserNotFoundError(this.system.user_id);
        }

        // console.warn('found user:', user);
    }

    async startup(): Promise<void> {}

    async cleanup(): Promise<void> {}
}