import _ from 'lodash';
import util from 'util';
import chai from 'chai';
import debug from 'debug';

// UUID is a common requirement
import { v4 as uuid } from 'uuid';

// Classes
import { KernelAuth } from '@classes/kernel-auth';
import { KernelData } from '@classes/kernel-data';
import { KernelMeta } from '@classes/kernel-meta';
import { KernelKnex } from '@classes/kernel-knex';

// Typedefs
import { Service } from "@typedefs/kernel";


export const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export class Kernel implements Service {
    // Import aliases
    public readonly uuid = uuid;
    public readonly expect = chai.expect;

    // General
    public static ID = '00000000-0000-0000-0000-000000000000';
    public static NS = 'system';

    // Services
    public readonly auth = new KernelAuth(this);
    public readonly data = new KernelData(this);
    public readonly meta = new KernelMeta(this);
    public readonly knex = new KernelKnex(this);

    // Kernel constants
    public readonly time = new Date();

    // Sudo root
    private sudo_chain: string[] = [];

    // Setup the user-specific kernel, or default to a root user.
    constructor(readonly user_id: string, readonly user_ns: string) {
        // Nil UUID doesn't technically meet UUID version format requirements
        if (user_id !== Kernel.ID) {
            chai.expect(user_id).a('string').match(UUID_REGEX);
        }

        // NS should always exist
        chai.expect(user_ns).a('string').not.empty;
    }

    //
    // Service Methods
    //

    async startup(): Promise<void> {
        // Start knex first so we have a transaction context
        await this.knex.startup();

        // Remaining services
        await this.data.startup();
        await this.meta.startup();
        await this.auth.startup();
    }

    async cleanup(): Promise<void> {
        // Shutdown services
        await this.data.cleanup();
        await this.meta.cleanup();
        await this.auth.cleanup();

        // Shutdown knex last so the transaction commits/rollbacks
        await this.knex.cleanup();
    }

    async refresh(): Promise<void> {
        await this.cleanup();
        await this.startup();
    }

    async certify(): Promise<void> {
        await this.auth.authenticate();
    }

    //
    // Methods
    //

    async run(executeFn: (kernel: Kernel) => Promise<any>) {
        try {
            // Startup
            await this.certify();
            await this.startup();
            
            // Run the logic
            await executeFn(this);
        }
        
        finally {
            await this.cleanup();
        }
    }

    emit(cn, fn, ... messages) {
        debug(cn + ':' + fn)(util.format(... messages));
    }

    isRoot(): boolean {
        return Kernel.ID === this.user_id || Kernel.ID === _.last(this.sudo_chain);
    }

    isTest(): boolean {
        return false;
    } 

    isProd(): boolean {
        return Bun.env.NODE_ENV === 'production';
    }

    timeISO(): string {
        return this.time.toISOString();
    }

    //
    // Root sudo contest
    //

    sudoRoot() {
        this.sudo_chain.push(Kernel.ID);
    }

    sudoExit() {
        this.sudo_chain.pop();
    }
}

