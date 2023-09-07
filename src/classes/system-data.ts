import _ from 'lodash';

// API
import { FilterJson } from '../classes/filter';
import { Record } from '../classes/record';
import { ChangeData } from '../classes/record';
import { ObserverRing } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { System } from '../classes/system';

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

    async createAll(schema_name: string, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema_name, change_data, {}, SystemData.Verb.Create);
    }

    async updateAll(schema_name: string, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema_name, change_data, {}, SystemData.Verb.Update);
    }

    async upsertAll(schema_name: string, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema_name, change_data, {}, SystemData.Verb.Upsert);
    }

    async deleteAll(schema_name: string, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema_name, change_data, {}, SystemData.Verb.Delete);
    }

    //
    // Single record methods
    //

    async createOne(schema_name: string, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema_name, Array(change_data), {}, SystemData.Verb.Create).then(headOne<Record>);
    }

    async updateOne(schema_name: string, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema_name, Array(change_data), {}, SystemData.Verb.Update).then(headOne<Record>);
    }

    async upsertOne(schema_name: string, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema_name, Array(change_data), {}, SystemData.Verb.Upsert).then(headOne<Record>);
    }

    async deleteOne(schema_name: string, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema_name, Array(change_data), {}, SystemData.Verb.Delete).then(headOne<Record>);
    }

    //
    // By ID or IDs
    //

    async select404(schema_name: string, record_id: string): Promise<Record> {
        return this.onRun(schema_name, [], { where: { id: record_id }}, SystemData.Verb.Select).then(head404<Record>);
    }

    async selectIds(schema_name: string, record_ids: string[]): Promise<Record[]> {
        return this.onRun(schema_name, [], { where: { id: record_ids }}, SystemData.Verb.Select);
    }

    async deleteIds(schema_name: string, record_ids: string[]): Promise<Record[]> {
        return this.onRun(schema_name, [], { where: { id: record_ids }}, SystemData.Verb.Delete);
    }

    //
    // Filter + Change ops
    //

    async selectAny(schema_name: string, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.onRun(schema_name, [], filter_data, SystemData.Verb.Select);
    }

    async updateAny(schema_name: string, filter_data: Partial<FilterJson>, change_data: ChangeData): Promise<Record[]> {
        throw 500; // TODO
    }

    async deleteAny(schema_name: string, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.onRun(schema_name, [], filter_data, SystemData.Verb.Delete);
    }

    //
    // Internal functions
    //

    private async onRun(schema_name: string, change_data: ChangeData[], filter_data: Partial<FilterJson>, op: string): Promise<Record[]> {
        console.debug('SystemData: schema=%j filter=%j', schema_name, filter_data, change_data);

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