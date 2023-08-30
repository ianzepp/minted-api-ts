
// Classes
import { ObserverFlow } from '../classes/observer-flow';

export class Observer {
    static readonly RING_INIT = 0; // System init
    static readonly RING_PREP = 1; // Logic prep
    static readonly RING_LOAD = 2; // Load in any data dependencies
    static readonly RING_WORK = 3; // Run logic
    static readonly RING_TEST = 4; // Validations
    static readonly RING_KNEX = 5; // Database changes
    static readonly RING_POST = 6; // Post-db changes
    static readonly RING_FLOW = 7; // Cascade down to more flow operations
    static readonly RING_HTTP = 8; // External HTTP updates, non-blocking
    static readonly RING_DONE = 9; // System cleanup

    static readonly PRIORITY_SYSTEM_MAX = 0;
    static readonly PRIORITY_MAX = 1;
    static readonly PRIORITY_AVG = 5;
    static readonly PRIORITY_MIN = 9;

    constructor() {}

    async run(flow: ObserverFlow): Promise<any> {
        throw 500;
    }

    toJSON() {
        return {
            'name': this.toName(),
            'on-schema': this.onSchema(),
            'on-ring': this.onRing(),
            'on-ring-priority': this.onRingPriority(),
            'on-select': this.onSelect(),
            'on-create': this.onCreate(),
            'on-update': this.onUpdate(),
            'on-upsert': this.onUpsert(),
            'on-delete': this.onDelete(),
        };
    }

    toName() {
        return __filename;
    }

    onSchema(): string {
        throw 500;
    }

    onRing() {
        return Observer.RING_WORK;
    }

    onRingPriority() {
        return Observer.PRIORITY_AVG;
    }

    onSelect() {
        return false;
    }

    onCreate() {
        return false;
    }

    onUpdate() {
        return false;
    }

    onUpsert() {
        return false;
    }

    onDelete() {
        return false;
    }

    isRunnable() {
        return true;
    }

    isFailable() {
        return false;
    }
}