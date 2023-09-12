
// Classes
import { ObserverFlow } from '@classes/observer-flow';

// Layouts
import { ObserverRank } from '@layouts/observer';
import { ObserverRing } from '@layouts/observer';

export class Observer {
    // Re-export aliases
    public static Rank = ObserverRank;
    public static Ring = ObserverRing;

    constructor() {}

    async startup(flow: ObserverFlow): Promise<any> {}
    async run(flow: ObserverFlow): Promise<any> {}
    async cleanup(flow: ObserverFlow): Promise<any> {}

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
            'on-expire': this.onExpire(),
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
        return ObserverRing.Work;
    }

    onRank(): ObserverRank {
        return ObserverRank.Avg;
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

    onExpire(): boolean {
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