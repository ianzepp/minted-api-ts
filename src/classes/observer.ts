
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

    toJSON(): Object {
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

    toName(): string {
        return __filename;
    }

    onSchema(): string {
        throw 500;
    }

    onRing(): ObserverRing {
        return Observer.Ring.Work;
    }

    onRank(): ObserverRank {
        return Observer.Rank.Avg;
    }

    onSelect(): boolean {
        return false;
    }

    onCreate(): boolean {
        return false;
    }

    onUpdate(): boolean {
        return false;
    }

    onUpsert(): boolean {
        return false;
    }

    onDelete(): boolean {
        return false;
    }

    isRunnable(): boolean {
        return true;
    }

    isFailable(): boolean {
        return false;
    }
}