import _ from 'lodash';
import Debug from 'debug';
import chai from 'chai';

// Debugging
const debug = Debug('minted:system:kernel');

// UUID is a common requirement
import { v4 as uuid } from 'uuid';

// Classes
import { KernelBulk } from '@kernel/classes/kernel/kernel-bulk';
import { KernelKnex } from '@kernel/classes/kernel/kernel-knex';
import { KernelData } from '@kernel/classes/kernel/kernel-data';
import { KernelMeta } from '@kernel/classes/kernel/kernel-meta';
import { KernelUser } from '@kernel/classes/kernel/kernel-user';
import { KernelSmtp } from '@kernel/classes/kernel/kernel-smtp';

// Match UUIDs
export const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export class Kernel {
    // Import aliases
    public readonly uuid = uuid;
    public readonly expect = chai.expect;

    // General
    public static ID = '00000000-0000-0000-0000-000000000000';
    public static NS = 'system';

    // Services
    public readonly bulk = new KernelBulk(this);
    public readonly data = new KernelData(this);
    public readonly knex = new KernelKnex(this);
    public readonly meta = new KernelMeta(this);
    public readonly user = new KernelUser(this);
    public readonly smtp = new KernelSmtp(this);

    // Kernel constants
    public readonly time = new Date();

    // Sudo root
    private sudo_chain: string[] = [];

    // Track kernel status
    private readonly statinfo: _.Dictionary<number> = {};

    // Constructor
    public constructor(public readonly user_id: string = Kernel.ID) {}

    //
    // Service Methods
    //

    async startup() {
        debug('startup() starting');

        // Knex has to load first
        await this.knex.startup();

        // Startup the rest
        await this.data.startup();
        await this.meta.startup();
        await this.user.startup();

        // These don't care
        await this.bulk.startup();
        await this.smtp.startup();

        debug('startup() done');
    }

    async cleanup() {
        debug('cleanup() starting');

        // Shut down
        await this.bulk.cleanup();
        await this.smtp.cleanup();

        await this.meta.cleanup();
        await this.data.cleanup();
        await this.user.cleanup();

        // Unload knex last
        await this.knex.cleanup();

        debug('cleanup() done');
    }

    async refresh(): Promise<void> {
        await this.cleanup();
        await this.startup();
    }

    //
    // Methods
    //

    isRoot(): boolean {
        return this.user_id === Kernel.ID
            || this.sudo_chain[this.sudo_chain.length - 1] === Kernel.ID;
    }

    isNodeTest(): boolean {
        return Bun.env.NODE_ENV === 'test';
    } 

    isNodeProduction(): boolean {
        return Bun.env.NODE_ENV === 'production';
    }

    timeISO(): string {
        return this.time.toISOString();
    }


    //
    //
    // Switch into or out of another user

    sudoRoot() {
        this.sudo_chain.push(Kernel.ID);
    }

    sudoUser(user_id: string) {
        this.sudo_chain.push(user_id);
    }

    sudoExit() {
        this.sudo_chain.pop();
    }

    //
    // Test helpers
    //

    toTestName() {
        return 'test_' + Math.floor(Math.random() * 1000000);
    }

    //
    // Kernel stats tracking
    //

    stats() {
        return _.assign({}, this.statinfo);
    }

    statbump(name: string, incr: number = 1) {
        this.statinfo[name] = incr + (this.statinfo[name] || 0);
    }
}
