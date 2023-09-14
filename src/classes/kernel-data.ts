import _ from 'lodash';

// Classes
import { ObserverFlow } from '@classes/observer-flow';
import { Record } from '@classes/record';
import { Kernel } from '@classes/kernel';

import { Schema } from '@classes/schema';
import { Filter } from '@classes/filter';

// Layouts
import { ChangeData } from '@layouts/record';
import { FilterJson } from '@layouts/filter';
import { Service } from '@layouts/kernel';
import { KernelVerb } from '@layouts/kernel';
import { ObserverRing } from '@layouts/observer';
import { SchemaName } from '@layouts/schema';


// Data API errors
export class DataError extends Error {};
export class RecordFoundError extends DataError {};
export class RecordNotFoundError extends DataError {};
export class RecordColumnImmutableError extends DataError {};
export class RecordColumnRequiredError extends DataError {};

import { toJSON } from './helpers';

// Local helpers
function headOne<T>(result: T[]): T | undefined {
    return _.head(result);
}

// Throws and error if no results
function head404<T>(result: T[]): T {
    let r = _.head(result);

    if (r === undefined) {
        throw new RecordNotFoundError();
    }

    return r;
}

// Opposite of `head404`. Throws an error if a result is found
function headNot<T>(result: T[]): void {
    let r = _.head(result);

    if (r !== undefined) {
        throw new RecordFoundError();
    }
}


// Implementation
export class KernelData implements Service {
    constructor(private readonly kernel: Kernel) {}

    async startup(): Promise<void> {}

    async cleanup(): Promise<void> {}

    //
    // Core runtime
    //

    async run(schema_name: Schema | SchemaName, change_data: ChangeData[], filter_data: Partial<FilterJson>, op: string): Promise<Record[]> {
        if (Bun.env.POSTGRES_DEBUG === 'true') {
            console.debug(`KernelData.run(): op="${op}" schema_name="${schema_name}" change_data.length="${change_data.length}" with filter:`, filter_data);
        }

        this.kernel.expect(change_data, 'change_data').an('array');
        this.kernel.expect(filter_data, 'filter_data').an('object');
        this.kernel.expect(op, 'op').a('string');

        let schema = this.kernel.meta.schemas.get(schema_name);
        let filter = new Filter(filter_data);

        // Is this something other than a select op, and the change data is empty?
        if (change_data.length === 0 && op !== KernelVerb.Select) {
            return [];
        }

        // Convert the raw change data into records
        let change = change_data.map(change => schema.toRecord(change));

        // Build the flow
        let flow = new ObserverFlow(this.kernel, schema, change, filter, op);

        // Cycle through rings 0 - 9
        for (let ring = 0 as ObserverRing; ring <= 9; ring++) {
            await flow.run(ring);
        }

        // Done
        return flow.change;
    }
    
    //
    // Collection record methods
    //

    async selectAll(schema_name: Schema | SchemaName, source_data: ChangeData[]): Promise<Record[]> {
        let schema = this.kernel.meta.schemas.get(schema_name);
        let source = source_data.map(change => schema.toRecord(change).data.id);

        return this.selectIds(schema, _.uniq(_.compact(source)));
    }

    async createAll(schema_name: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(schema_name, change_data, {}, KernelVerb.Create);
    }

    async updateAll(schema_name: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(schema_name, change_data, {}, KernelVerb.Update);
    }

    async upsertAll(schema_name: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(schema_name, change_data, {}, KernelVerb.Upsert);
    }

    async expireAll(schema_name: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(schema_name, change_data, {}, KernelVerb.Expire);
    }

    async deleteAll(schema_name: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(schema_name, change_data, {}, KernelVerb.Delete);
    }

    //
    // Single record methods
    //

    async selectOne(schema_name: Schema | SchemaName, source_data: ChangeData): Promise<Record | undefined> {
        return this.selectAll(schema_name, [source_data]).then(headOne<Record>);
    }

    async createOne(schema_name: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        return this.createAll(schema_name, [change_data]).then(headOne<Record>);
    }

    async updateOne(schema_name: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        return this.updateAll(schema_name, [change_data]).then(headOne<Record>);
    }

    async upsertOne(schema_name: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        return this.upsertAll(schema_name, [change_data]).then(headOne<Record>);
    }

    async expireOne(schema_name: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        return this.expireAll(schema_name, [change_data]).then(headOne<Record>);
    }

    async deleteOne(schema_name: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        return this.deleteAll(schema_name, [change_data]).then(headOne<Record>);
    }

    //
    // Search ops. Basically a `select` but with a filter to support a slightly different API
    // 

    async searchAny(schema_name: Schema | SchemaName, filter_data: Partial<FilterJson> = {}): Promise<Record[]> {
        return this.selectAny(schema_name, filter_data);
    }

    async searchOne(schema_name: Schema | SchemaName, filter_data: Partial<FilterJson> = {}): Promise<Record | undefined> {
        return this.selectAny(schema_name, filter_data).then(headOne);
    }

    async search404(schema_name: Schema | SchemaName, filter_data: Partial<FilterJson> = {}): Promise<Record> {
        return this.selectAny(schema_name, filter_data).then(head404);
    }

    async searchNot(schema_name: Schema | SchemaName, filter_data: Partial<FilterJson> = {}): Promise<void> {
        return this.selectAny(schema_name, filter_data).then(headNot);
    }

    //
    // Filter + Change ops
    //

    async selectAny(schema_name: Schema | SchemaName, filter_data: Partial<FilterJson> = {}): Promise<Record[]> {
        return this.run(schema_name, [], filter_data, KernelVerb.Select);
    }

    async updateAny(schema_name: Schema | SchemaName, filter_data: Partial<FilterJson>, change_data: ChangeData): Promise<Record[]> {
        return this.selectAny(schema_name, filter_data).then(result => {
            result.forEach(record => _.assign(record.data, change_data));
            return this.updateAll(schema_name, result);
        });
    }

    async expireAny(schema_name: Schema | SchemaName, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.selectAny(schema_name, filter_data).then(result => this.expireAll(schema_name, result));
    }

    async deleteAny(schema_name: Schema | SchemaName, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.selectAny(schema_name, filter_data).then(result => this.deleteAll(schema_name, result));
    }

    //
    // By ID or IDs
    //

    async select404(schema_name: Schema | SchemaName, record_one: string): Promise<Record> {
        return this.selectAny(schema_name, { where: { id: record_one }}).then(head404<Record>);
    }

    async selectIds(schema_name: Schema | SchemaName, record_ids: string[]): Promise<Record[]> {
        return this.selectAny(schema_name, { where: { id: record_ids }});
    }

    async updateIds(schema_name: Schema | SchemaName, record_ids: string[], change_data: ChangeData): Promise<Record[]> {
        return this.updateAny(schema_name, { where: { id: record_ids }}, change_data);
    }

    async expireIds(schema_name: Schema | SchemaName, record_ids: string[]): Promise<Record[]> {
        return this.expireAny(schema_name, { where: { id: record_ids }});
    }

    async deleteIds(schema_name: Schema | SchemaName, record_ids: string[]): Promise<Record[]> {
        return this.deleteAny(schema_name, { where: { id: record_ids }});
    }
}