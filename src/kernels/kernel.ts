import _ from 'lodash';
import util from 'util';
import chai from 'chai';
import debug from 'debug';

// UUID is a common requirement
import { v4 as uuid } from 'uuid';

// Classes
import { KernelBulk } from '@kernels/kernel-bulk';
import { KernelData } from '@kernels/kernel-data';
import { KernelMeta } from '@kernels/kernel-meta';
import { KernelUser } from '@kernels/kernel-user';
import { KernelSmtp } from '@kernels/kernel-smtp';

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
    public readonly meta = new KernelMeta(this);
    public readonly user = new KernelUser(this);
    public readonly smtp = new KernelSmtp(this);

    // Kernel constants
    public readonly time = new Date();

    // Sudo root
    private sudo_chain: string[] = [];

    //
    // Service Methods
    //

    async startup(): Promise<void> {
        await this.data.startup();
        await this.meta.startup();
        await this.bulk.startup();
        await this.user.startup();
        await this.smtp.startup();
    }

    async cleanup(): Promise<void> {
        await this.meta.cleanup();
        await this.data.cleanup();
        await this.bulk.cleanup();
        await this.user.cleanup();
        await this.smtp.cleanup();
    }

    async refresh(): Promise<void> {
        await this.cleanup();
        await this.startup();
    }

    //
    // Methods
    //

    emit(cn, fn, ... messages) {
        debug(cn + ':' + fn)(util.format(... messages));
    }

    isRoot(): boolean {
        return this.sudo_chain.length === 0 
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
    // User ID, NS, and namespaces
    //

    get user_id() {
        return Kernel.ID;
    }

    get user_ns() {
        return Kernel.NS;
    }

    get namespaces() {
        return _.uniq(_.compact(['system', this.user_ns]));
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
}

//
// Kernel Test User
//

