import _ from 'lodash';
import chai from 'chai';
import jwt from 'jsonwebtoken';

// Classes
import { Kernel } from '@classes/kernel';

// Layouts
import { Service } from '@layouts/kernel';

// User API errors
export class AuthError extends Error {};
export class AuthUserNotFoundError extends AuthError {};
export class AuthClientNotFoundError extends AuthError {};

// Sanity
if (Bun.env.NODE_ENV === 'production') {
    chai.assert(Bun.env.JWT_SECRET, '"Bun.env.JWT_SECRET" is missing');
}

export class KernelAuth implements Service {
    // JWT secret used for dev
    private static JWT_SECRET = Bun.env.JWT_SECRET || 'development-password';
    private static JWT_OPTION = { expiresIn: '1h' };

    constructor(private readonly kernel: Kernel) {}

    get id() {
        return this.kernel.user_id;
    }

    get ns() {
        return this.kernel.user_ns;
    }

    get namespaces() {
        return _.uniq(_.compact(['system', this.ns]));
    }

    async startup(): Promise<void> {}
    async cleanup(): Promise<void> {}

    async authenticate() {
        // Verify user record exists and has access to the kernel
        let user = this.kernel.knex.driverTo('system.user')
            .where('id', this.kernel.user_id)
            .column(['id', 'ns'])
            .first();

        if (user === undefined) {
            throw new AuthUserNotFoundError(this.kernel.user_id);
        }

        return user;
    }

    async signin() {
        return jwt.sign({
            id: this.kernel.user_id,
            ns: this.kernel.user_ns,
        }, KernelAuth.JWT_SECRET, KernelAuth.JWT_OPTION);
    }

    async signup() {
        // nothing done right now
    }
}