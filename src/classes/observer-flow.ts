import _ from 'lodash';

// Classes
import { Filter } from '../classes/filter';
import { Record } from '../classes/record';
import { Schema } from '../classes/schema';
import { Observer } from '../classes/observer';
import { ObserverRing } from '../classes/observer';
import { System } from '../classes/system';

// Flow files
// export const FLOWS: Array<typeof Observer> = [
//     require('../flows/system__record/knex-create').default,
//     require('../flows/system__record/knex-delete').default,
//     require('../flows/system__record/knex-reload').default,
//     require('../flows/system__record/knex-select').default,
//     require('../flows/system__record/knex-update').default,
// ];

// Implementation
export class ObserverFlow {
    private observers: Observer[] = [];

    constructor(
        readonly system: System,
        readonly schema: Schema,
        readonly change: Record[],
        readonly filter: Filter,
        readonly op: string) {}

    isSelect() {
        return this.op === 'select';
    }

    isCreate() {
        return this.op === 'create';
    }

    isUpdate() {
        return this.op === 'update';
    }

    isUpsert() {
        return this.op === 'upsert';
    }

    isDelete() {
        return this.op === 'delete';
    }

    onSchema() {
        return this.schema.name;
    }

    async initialize() {

    }

    async run(ring: ObserverRing) {
        // Filter down from the master observer list to only be the ones for this ring
        let observers = this.observers.filter(observer => observer.onRing() === ring);

        // Walk and run
        for(let observer of observers) {
            await observer.run();
        }

        // Done
    }

    //
    // Helpers
    //

    // private toObservers(): Observer[] {
    //     return _.compact(FLOWS.map(FlowType => {
    //         // Create the flow
    //         let flow = new FlowType(this.system, this);

    //         // Filter flows by schema type
    //         if (this.onSchema() !== flow.onSchema() && flow.onSchema() !== 'system__record') {
    //             return;
    //         }

    //         // Filter flows by operation
    //         if (this.isSelect() && flow.onSelect()) {
    //             return flow;
    //         }

    //         if (this.isCreate() && flow.onCreate()) {
    //             return flow;
    //         }

    //         if (this.isUpdate() && flow.onUpdate()) {
    //             return flow;
    //         }

    //         if (this.isUpsert() && flow.onUpsert()) {
    //             return flow;
    //         }

    //         if (this.isDelete() && flow.onDelete()) {
    //             return flow;
    //         }
    //     }));
    // }
}