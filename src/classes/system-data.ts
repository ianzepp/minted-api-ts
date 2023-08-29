import _, { forEach } from 'lodash';

// API
import { FilterJson } from '../classes/filter';
import { SchemaName } from '../classes/schema';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';
import { ObserverRing } from '../classes/observer-flow';
import { ObserverFlow } from '../classes/observer-flow';
import { System } from '../classes/system';

// Helpers
import head404 from '../helpers/head404';
import headOne from '../helpers/headOne';

export class SystemData {
    static readonly OP_SELECT = 'select';
    static readonly OP_CREATE = 'create';
    static readonly OP_UPDATE = 'update';
    static readonly OP_UPSERT = 'upsert';
    static readonly OP_DELETE = 'delete';

    constructor(private readonly system: System) {}

    async startup() {
        // nothing to do here
    }

    //
    // Collection record methods
    //

    async createAll(schema_name: SchemaName, change_data: Partial<RecordJson>[]) {
        return this._run(schema_name, change_data, {}, SystemData.OP_CREATE);
    }

    async updateAll(schema_name: SchemaName, change_data: Partial<RecordJson>[]) {
        return this._run(schema_name, change_data, {}, SystemData.OP_UPDATE);
    }

    async upsertAll(schema_name: SchemaName, change_data: Partial<RecordJson>[]) {
        return this._run(schema_name, change_data, {}, SystemData.OP_UPSERT);
    }

    async deleteAll(schema_name: SchemaName, change_data: Partial<RecordJson>[]) {
        return this._run(schema_name, change_data, {}, SystemData.OP_DELETE);
    }

    //
    // Single record methods
    //

    async createOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this._run(schema_name, Array(change_data), {}, SystemData.OP_CREATE).then(headOne<Record>);
    }

    async updateOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this._run(schema_name, Array(change_data), {}, SystemData.OP_UPDATE).then(headOne<Record>);
    }

    async upsertOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this._run(schema_name, Array(change_data), {}, SystemData.OP_UPSERT).then(headOne<Record>);
    }

    async deleteOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this._run(schema_name, Array(change_data), {}, SystemData.OP_DELETE).then(headOne<Record>);
    }

    //
    // By ID or IDs
    //

    async select404(schema_name: SchemaName, record_id: string): Promise<Record> {
        return this._run(schema_name, [], { where: { id: record_id }}, SystemData.OP_SELECT).then(head404<Record>);
    }

    async selectIds(schema_name: SchemaName, record_ids: string[]): Promise<Record[]> {
        return this._run(schema_name, [], { where: { id: record_ids }}, SystemData.OP_SELECT);
    }

    async deleteIds(schema_name: SchemaName, record_ids: string[]): Promise<Record[]> {
        return this._run(schema_name, [], { where: { id: record_ids }}, SystemData.OP_DELETE);
    }

    //
    // Filter + Change ops
    //

    async selectAny(schema_name: SchemaName, filter_data: FilterJson): Promise<Record[]> {
        return this._run(schema_name, [], filter_data, SystemData.OP_SELECT);
    }

    async updateAny(schema_name: SchemaName, filter_data: FilterJson, change_data: Partial<RecordJson>): Promise<Record[]> {
        throw 500; // TODO
    }

    async deleteAny(schema_name: SchemaName, filter_data: FilterJson): Promise<Record[]> {
        return this._run(schema_name, [], filter_data, SystemData.OP_DELETE);
    }

    //
    // Internal functions
    //

    private async _run(schema_name: SchemaName, change_data: Partial<RecordJson>[], filter_data: FilterJson, op: string): Promise<Record[]> {
        console.debug('SystemData: schema=%j filter=%j', schema_name, filter_data, change_data);

        let schema = this.system.meta.toSchema(schema_name);
        let filter = schema.toFilter(filter_data);
        let change = schema.toRecordSet(change_data);

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