
// Classes
import { ObserverFlow } from '../classes/observer-flow';

export enum ObserverRank {
    SystemMax = 0,
    Max = 1,
    Avg = 5,
    Min = 9,
}

export enum ObserverRing {
    Init = 0, // System init
    Prep = 1, // Logic prep
    Load = 2, // Load in any data dependencies
    Work = 3, // Run logic
    Test = 4, // Validations
    Knex = 5, // Database changes
    Post = 6, // Post-db changes
    Flow = 7, // Cascade down to more flow operations
    Http = 8, // External HTTP updates, non-blocking
    Done = 9, // System cleanup
}

export class Observer {
    // Re-export aliases
    public static Rank = ObserverRank;
    public static Ring = ObserverRing;

    constructor() {}

    async run(flow: ObserverFlow): Promise<any> {
        throw 500;
    }

    toJSON() {
        return {
            'name': this.toName(),
            'on-schema': this.onSchema(),
            'on-ring': this.onRing(),
            'on-rank': this.onRank(),
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
        return Observer.Ring.Work;
    }

    onRank() {
        return Observer.Rank.Avg;
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