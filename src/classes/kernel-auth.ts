import _ from 'lodash';
import chai from 'chai';
import jwt from 'jsonwebtoken';

// Classes
import { Kernel } from '@classes/kernel';
import { Record } from '@classes/record';

// Typedefs
import { Service } from '@typedefs/kernel';
import { ObjectType } from '@typedefs/object';

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

    // What is the user's config data?
    public readonly config = new Map<string, string>();

    constructor(private readonly kernel: Kernel) {}

    async startup(): Promise<void> {
        await this.authenticate();
        await this.configure(await this.kernel.data.selectAny(ObjectType.Config));
    }

    async cleanup(): Promise<void> {
        await this.configure([]);
    }

    //
    // Property shortcuts
    //

    get id() {
        return this.kernel.user_id;
    }

    get ns() {
        return this.kernel.user_ns;
    }

    get namespaces() {
        return _.uniq(_.compact(['system', this.ns]));
    }

    //
    // Authentication process
    //

    async authenticate() {
        // Verify user record exists and has access to the kernel
        let user = this.kernel.knex.driverTo(ObjectType.User)
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


    //
    // User configurations
    //

    async configure(configs: Record[]) {
        // Clear any old data
        this.config.clear();

        // Import the new data
        configs.forEach(config => this.config.set(config.data.name, config.data.data));
    }
}