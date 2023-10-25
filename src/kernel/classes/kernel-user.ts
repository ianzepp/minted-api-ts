import _ from 'lodash';

// Classes
import { Kernel } from '@kernel/classes/kernel';
import { ObjectType } from '@system/classes/object';

// Implementation
export class KernelUser {
    private readonly data: _.Dictionary<any> = {};

    constructor(private readonly kernel: Kernel) {}

    async startup() {
        // If we are running as root, no need to load anything
        if (this.kernel.isRoot()) {
            return;
        }

        // If the user object doesn't exist, we might as well be running as root
        if (this.kernel.meta.exists(ObjectType.User) === false) {
            return;
        }

        // Find the user record
        let user = await this.kernel.data.select404(ObjectType.User, this.kernel.user_id);

        // Is the user active?
        if (user.data.active !== true) {
            throw `User '${ this.kernel.user_id } is not active`;
        }

        // Done for now
        _.assign(this.data, user.data);
    }

    async cleanup() {
        if (this.kernel.isRoot()) {
            return; // nothing to do.
        }
    }

    //
    // User data
    //

    get id() {
        return this.data.id || Kernel.ID;
    }

    get ns() {
        return this.data.ns || Kernel.NS;
    }

    get namespaces() {
        return _.uniq(_.compact(['system', this.ns]));
    }
}
