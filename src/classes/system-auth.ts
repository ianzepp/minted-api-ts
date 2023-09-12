import _ from 'lodash';
import chai from 'chai';
import jwt from 'jsonwebtoken';

// Classes
import { System } from '@classes/system';
import { SystemService } from '@classes/system';

// User API errors
export class AuthError extends Error {};
export class AuthUserNotFoundError extends AuthError {};
export class AuthClientNotFoundError extends AuthError {};

// Sanity
if (Bun.env.NODE_ENV === 'production') {
    chai.assert(Bun.env.JWT_SECRET, '"Bun.env.JWT_SECRET" is missing');
}

export class SystemAuth implements SystemService {
    // JWT secret used for dev
    private static JWT_SECRET = Bun.env.JWT_SECRET || 'development-password';
    private static JWT_OPTION = { expiresIn: '1h' };

    constructor(private readonly system: System) {}

    get id() {
        return this.system.user_id;
    }

    get ns() {
        return this.system.user_ns;
    }

    get namespaces() {
        return _.uniq(_.compact(['system', this.ns]));
    }

    async startup(): Promise<void> {}
    async cleanup(): Promise<void> {}

    async authenticate() {
        // Verify user record exists and has access to the system
        let user = this.system.knex.driverTo('system.client_user', 'data')
            .where('data.id', this.system.user_id)
            .first();

        if (user === undefined) {
            throw new AuthUserNotFoundError(this.system.user_id);
        }

        return user;
    }

    async signin() {
        return jwt.sign({
            id: this.system.user_id,
            ns: this.system.user_ns,
        }, SystemAuth.JWT_SECRET, SystemAuth.JWT_OPTION);
    }

    async signup() {
        // nothing done right now
    }
}