import _ from 'lodash';

// Classes
import { ObserverFlow } from '@classes/observer-flow';
import { Record } from '@classes/record';
import { System } from '@classes/system';
import { SystemService } from '@classes/system';
import { Schema } from '@classes/schema';

// Layouts
import { ChangeData } from '@layouts/record';
import { FilterJson } from '@layouts/filter';
import { ObserverRing } from '@layouts/observer';
import { SchemaName } from '@layouts/schema';
import { SystemVerb } from '@layouts/system';

// Helpers
import head404 from '@helpers/head404';
import headOne from '@helpers/headOne';

// Data API errors
export class DataError extends Error {};
export class RecordNotFoundError extends DataError {};
export class RecordColumnImmutableError extends DataError {};
export class RecordColumnRequiredError extends DataError {};

// Implementation
export class SystemData implements SystemService {
    constructor(private readonly system: System) {}

    async startup(): Promise<void> {}

    async cleanup(): Promise<void> {}

    //
    // Collection record methods
    //

    async createAll(schema: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema, change_data, {}, SystemVerb.Create);
    }

    async updateAll(schema: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema, change_data, {}, SystemVerb.Update);
    }

    async upsertAll(schema: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema, change_data, {}, SystemVerb.Upsert);
    }

    async expireAll(schema: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema, change_data, {}, SystemVerb.Expire);
    }

    async deleteAll(schema: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.onRun(schema, change_data, {}, SystemVerb.Delete);
    }

    //
    // Single record methods
    //

    async createOne(schema: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema, Array(change_data), {}, SystemVerb.Create).then(headOne<Record>);
    }

    async updateOne(schema: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema, Array(change_data), {}, SystemVerb.Update).then(headOne<Record>);
    }

    async upsertOne(schema: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema, Array(change_data), {}, SystemVerb.Upsert).then(headOne<Record>);
    }

    async expireOne(schema: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema, Array(change_data), {}, SystemVerb.Expire).then(headOne<Record>);
    }

    async deleteOne(schema: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        return this.onRun(schema, Array(change_data), {}, SystemVerb.Delete).then(headOne<Record>);
    }

    //
    // By ID or IDs
    //

    async select404(schema: Schema | SchemaName, record_id: string): Promise<Record> {
        return this.onRun(schema, [], { where: { id: record_id }}, SystemVerb.Select).then(head404<Record>);
    }

    async selectIds(schema: Schema | SchemaName, record_ids: string[]): Promise<Record[]> {
        return this.onRun(schema, [], { where: { id: record_ids }}, SystemVerb.Select);
    }

    async expireIds(schema: Schema | SchemaName, record_ids: string[]): Promise<Record[]> {
        return this.onRun(schema, [], { where: { id: record_ids }}, SystemVerb.Expire);
    }

    async deleteIds(schema: Schema | SchemaName, record_ids: string[]): Promise<Record[]> {
        return this.onRun(schema, [], { where: { id: record_ids }}, SystemVerb.Delete);
    }

    //
    // Filter + Change ops
    //

    async selectAny(schema: Schema | SchemaName, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.onRun(schema, [], filter_data, SystemVerb.Select);
    }

    async updateAny(schema: Schema | SchemaName, filter_data: Partial<FilterJson>, change_data: ChangeData): Promise<Record[]> {
        throw 500; // TODO
    }

    async expireAny(schema: Schema | SchemaName, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.onRun(schema, [], filter_data, SystemVerb.Expire);
    }

    async deleteAny(schema: Schema | SchemaName, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.onRun(schema, [], filter_data, SystemVerb.Delete);
    }

    //
    // Internal functions
    //

    private async onRun(schema_name: Schema | SchemaName, change_data: ChangeData[], filter_data: Partial<FilterJson>, op: string): Promise<Record[]> {
        let schema = this.system.meta.toSchema(schema_name);
        let filter = this.system.meta.toFilter(schema_name, filter_data);

        // console.debug('SystemData.onRun(): op=%j schema=%j filter=%j change=%j', op, schema.schema_name, filter, change_data);

        // Convert the raw change data into records
        let change = change_data.map(change => schema.toRecord(change));

        // Build the flow
        let flow = new ObserverFlow(this.system, schema, change, filter, op);

        // Cycle through rings 0 - 9
        for (let ring = 0 as ObserverRing; ring <= 9; ring++) {
            await flow.run(ring);
        }

        // Done
        return flow.change;
    }
}