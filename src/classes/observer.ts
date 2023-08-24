
// Classes
import { ObserverFlow } from '../classes/observer-flow';
import { System } from '../classes/system';

export type ObserverRing = 'init' | 'prep' | 'work' | 'post' | 'done';

export class Observer {
    static readonly RING_INIT: ObserverRing = 'init';
    static readonly RING_PREP: ObserverRing = 'prep';
    static readonly RING_WORK: ObserverRing = 'work';
    static readonly RING_POST: ObserverRing = 'post';
    static readonly RING_DONE: ObserverRing = 'done';

    static readonly PRIORITY_SYSTEM_MAX = 0;
    static readonly PRIORITY_MAX = 1;
    static readonly PRIORITY_AVG = 5;
    static readonly PRIORITY_MIN = 9;

    constructor(readonly system: System, readonly flow: ObserverFlow) {}

    get schema() {
        return this.flow.schema;
    }

    get change() {
        return this.flow.change;
    }

    get filter() {
        return this.flow.filter;
    }

    async run(): Promise<any> {
        throw 500;
    }

    toJSON() {
        return {
            'on-schema': this.onSchema(),
            'on-ring': this.onRing(),
            'on-ring-priority': this.onRingPriority(),
            'on-root': this.onRoot(),
            'on-user': this.onUser(),
            'on-select': this.onSelect(),
            'on-create': this.onCreate(),
            'on-update': this.onUpdate(),
            'on-upsert': this.onUpsert(),
            'on-delete': this.onDelete(),
        };
    }

    onSchema(): string {
        throw 500;
    }

    onRing() {
        return Observer.RING_PREP;
    }

    onRingPriority() {
        return Observer.PRIORITY_AVG;
    }

    onRoot() {
        return true;
    }

    onUser() {
        return true;
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

    isSelect() {
        return this.flow.isSelect();
    }

    isCreate() {
        return this.flow.isCreate();
    }

    isUpdate() {
        return this.flow.isUpdate();
    }

    isUpsert() {
        return this.flow.isUpsert();
    }

    isDelete() {
        return this.flow.isDelete();
    }
}