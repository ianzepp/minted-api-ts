import _ from 'lodash';

// Classes
import { ObserverFlow } from '../classes/observer-flow';
import { Record } from '../classes/record';
import { System } from '../classes/system';
import { SystemService } from '../classes/system';
import { Schema } from '../classes/schema';

// Layouts
import { ChangeData } from '../layouts/record';
import { FilterJson } from '../layouts/filter';
import { ObserverRing } from '../layouts/observer';
import { SchemaName } from '../layouts/schema';
import { SystemVerb } from '../layouts/system';

// Data API errors
export class DataError extends Error {};
export class RecordNotFoundError extends DataError {};
export class RecordColumnImmutableError extends DataError {};
export class RecordColumnRequiredError extends DataError {};

// Local helpers
function headOne<T>(result: T[]): T | undefined {
    return _.head(result);
}

function head404<T>(result: T[]): T {
    let r = _.head(result);

    if (r === undefined) {
        throw new RecordNotFoundError();
    }

    return r;
}


// Implementation
export class SystemData implements SystemService {
    constructor(private readonly system: System) {}

    async startup(): Promise<void> {}

    async cleanup(): Promise<void> {}

    //
    // Core runtime
    //

    async run(schema_name: Schema | SchemaName, change_data: ChangeData[], filter_data: Partial<FilterJson>, op: string): Promise<Record[]> {
        if (process.env.POSTGRES_DEBUG === 'true') {
            console.debug('SystemData.onRun()', op, schema_name, filter_data, change_data.length);
        }

        this.system.expect(change_data, 'change_data').an('array');
        this.system.expect(filter_data, 'filter_data').an('object');
        this.system.expect(op, 'op').a('string');

        let schema = this.system.meta.toSchema(schema_name);
        let filter = this.system.meta.toFilter(schema_name, filter_data);

        // Is this something other than a select op, and the change data is empty?
        if (change_data.length === 0 && op !== SystemVerb.Select) {
            return [];
        }

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
    
    //
    // Collection record methods
    //

    async selectAll(schema_name: Schema | SchemaName, source_data: ChangeData[]): Promise<Record[]> {
        let schema = this.system.meta.toSchema(schema_name);
        let source = source_data.map(change => schema.toRecord(change).data.id);

        return this.selectIds(schema, _.uniq(_.compact(source)));
    }

    async createAll(schema_name: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(schema_name, change_data, {}, SystemVerb.Create);
    }

    async updateAll(schema_name: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(schema_name, change_data, {}, SystemVerb.Update);
    }

    async upsertAll(schema_name: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(schema_name, change_data, {}, SystemVerb.Upsert);
    }

    async expireAll(schema_name: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(schema_name, change_data, {}, SystemVerb.Expire);
    }

    async deleteAll(schema_name: Schema | SchemaName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(schema_name, change_data, {}, SystemVerb.Delete);
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
    // Filter + Change ops
    //

    async selectAny(schema_name: Schema | SchemaName, filter_data: Partial<FilterJson> = {}): Promise<Record[]> {
        return this.run(schema_name, [], filter_data, SystemVerb.Select);
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