import _, { forEach } from 'lodash';

// API
import { FilterJson } from '../classes/filter';
import { SchemaName } from '../classes/schema';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { System } from '../classes/system';

// Helpers
import { headOne, head404 } from '../classes/helpers';

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
    // Collection methods
    //

    async selectAll(schema_name: SchemaName, filter_data: FilterJson = {}) {
        return this._run(schema_name, [], filter_data, SystemData.OP_SELECT);
    }

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

    async selectOne(schema_name: SchemaName, filter_data: FilterJson = {}): Promise<Record | undefined> {
        return this.selectAll(schema_name, filter_data).then(headOne<Record>);
    }

    async select404(schema_name: SchemaName, change_data: FilterJson): Promise<Record> {
        return this.selectAll(schema_name, change_data).then(head404<Record>);
    }

    async selectIds(schema_name: SchemaName, filter_data: string[]): Promise<Record[]> {
        return this.selectAll(schema_name, {
            where: { id: { $in: filter_data } }
        });
    }

    async createOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this.createAll(schema_name, Array(change_data)).then(headOne<Record>);
    }

    async updateOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this.updateAll(schema_name, Array(change_data)).then(headOne<Record>);
    }

    async upsertOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this.upsertAll(schema_name, Array(change_data)).then(headOne<Record>);
    }

    async deleteOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this.deleteAll(schema_name, Array(change_data)).then(headOne<Record>);
    }

    //
    // Filter + Change ops
    //

    async updateAny(_schema_name: SchemaName, _filter_data: FilterJson, _change_data: Partial<RecordJson>) {
        throw "Unimplemented";
    }

    async deleteAny(_schema_name: SchemaName, _filter_data: FilterJson) {
        throw "Unimplemented";
    }

    //
    // Internal functions
    //

    private async _run(schema_name: SchemaName, change_data: Partial<RecordJson>[], filter_data: FilterJson, op: string): Promise<Record[]> {
        console.debug('SystemData', schema_name, filter_data, change_data);

        let schema = this.system.meta.toSchema(schema_name);
        let filter = schema.toFilter(filter_data);
        let change = schema.toRecordSet(change_data);

        // Build the flow
        let flow = new ObserverFlow(this.system, schema, change, filter, op);

        // Cycle through rings 0 - 9
        for (let ring = 0; ring <= 9; ring++) {
            await flow.run(ring);
        }

        // Done
        return flow.change;
    }
}