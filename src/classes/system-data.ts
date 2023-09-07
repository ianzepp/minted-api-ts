import _ from 'lodash';

// API
import { FilterJson } from '../classes/filter';
import { Record } from '../classes/record';
import { ChangeData } from '../classes/record';
import { ObserverRing } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { System } from '../classes/system';
import { Schema } from '../classes/schema';

// Helpers
import head404 from '../helpers/head404';
import headOne from '../helpers/headOne';

export enum SystemVerb {
    Create = 'create',
    Delete = 'delete',
    Select = 'select',
    Update = 'update',
    Upsert = 'upsert',
}

export class SystemData {
    // Re-export aliases
    public static Verb = SystemVerb;

    constructor(private readonly __system: System) {}

    async startup(): Promise<void> {
        // nothing to do here
    }

    //
    // Collection record methods
    //

    async createAll(schema: Schema | string, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema, change_data, {}, SystemData.Verb.Create);
    }

    async updateAll(schema: Schema | string, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema, change_data, {}, SystemData.Verb.Update);
    }

    async upsertAll(schema: Schema | string, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema, change_data, {}, SystemData.Verb.Upsert);
    }

    async deleteAll(schema: Schema | string, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema, change_data, {}, SystemData.Verb.Delete);
    }

    //
    // Single record methods
    //

    async createOne(schema: Schema | string, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema, Array(change_data), {}, SystemData.Verb.Create).then(headOne<Record>);
    }

    async updateOne(schema: Schema | string, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema, Array(change_data), {}, SystemData.Verb.Update).then(headOne<Record>);
    }

    async upsertOne(schema: Schema | string, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema, Array(change_data), {}, SystemData.Verb.Upsert).then(headOne<Record>);
    }

    async deleteOne(schema: Schema | string, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema, Array(change_data), {}, SystemData.Verb.Delete).then(headOne<Record>);
    }

    //
    // By ID or IDs
    //

    async select404(schema: Schema | string, record_id: string): Promise<Record> {
        return this.onRun(schema, [], { where: { id: record_id }}, SystemData.Verb.Select).then(head404<Record>);
    }

    async selectIds(schema: Schema | string, record_ids: string[]): Promise<Record[]> {
        return this.onRun(schema, [], { where: { id: record_ids }}, SystemData.Verb.Select);
    }

    async deleteIds(schema: Schema | string, record_ids: string[]): Promise<Record[]> {
        return this.onRun(schema, [], { where: { id: record_ids }}, SystemData.Verb.Delete);
    }

    //
    // Filter + Change ops
    //

    async selectAny(schema: Schema | string, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.onRun(schema, [], filter_data, SystemData.Verb.Select);
    }

    async updateAny(schema: Schema | string, filter_data: Partial<FilterJson>, change_data: ChangeData): Promise<Record[]> {
        throw 500; // TODO
    }

    async deleteAny(schema: Schema | string, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.onRun(schema, [], filter_data, SystemData.Verb.Delete);
    }

    //
    // Internal functions
    //

    private async onRun(schema_name: Schema | string, change_data: ChangeData[], filter_data: Partial<FilterJson>, op: string): Promise<Record[]> {
        let schema = this.__system.meta.toSchema(schema_name);
        let filter = this.__system.meta.toFilter(schema_name, filter_data);

        // Convert the raw change data into records
        let change = change_data.map(change => schema.toRecord(change));

        // Build the flow
        let flow = new ObserverFlow(this.__system, schema, change, filter, op);

        // Cycle through rings 0 - 9
        for (let ring = 0 as ObserverRing; ring <= 9; ring++) {
            await flow.run(ring);
        }

        // Done
        return flow.change;
    }
}