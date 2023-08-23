/**
* SystemData class contains methods for performing CRUD operations on the system data.
* Each method corresponds to a specific operation:
* - selectAll: Retrieves all records that match the provided filter.
* - createAll: Creates new records based on the provided data.
* - updateAll: Updates existing records based on the provided data.
* - upsertAll: Updates existing records or creates new ones if they don't exist, based on the provided data.
* - deleteAll: Deletes records that match the provided filter.
* - selectOne: Retrieves a single record that matches the provided filter.
* - select404: Retrieves a single record that matches the provided filter or throws a 404 error if no match is found.
* - selectIds: Retrieves records with IDs that match the provided list of IDs.
* - createOne: Creates a single new record based on the provided data.
* - updateOne: Updates a single existing record based on the provided data.
* - upsertOne: Updates an existing record or creates a new one if it doesn't exist, based on the provided data.
* - deleteOne: Deletes a single record that matches the provided filter.
* - updateAny: Updates any records that match the provided filter (currently unimplemented).
* - deleteAny: Deletes any records that match the provided filter (currently unimplemented).
* 
* The _run method is a private method used internally by the other methods to perform the actual operations.
*/

import _ from 'lodash';

// API
import { ChangeData } from '../types/record';
import { FilterJson } from '../types/filter';
import { SchemaName } from '../types/schema';
import { RecordInfo } from '../types/record';

// Classes
// import { Flow } from '../classes/flow';
// import { FlowSeries } from '../classes/flow-series';
import { System } from '../classes/system';
// import { SystemError } from '../classes/system-error';

function __head_one(result: RecordInfo[]): RecordInfo | undefined {
    return _.head(result);
}

function __head_404(result: RecordInfo[]): RecordInfo {
    let result_item = _.head(result);

    if (result_item === undefined) {
        throw 404;
    }

    return result_item;
}

export class SystemData {
    static readonly OP_SELECT = 'select';
    static readonly OP_CREATE = 'create';
    static readonly OP_UPDATE = 'update';
    static readonly OP_UPSERT = 'upsert';
    static readonly OP_DELETE = 'delete';

    constructor(private readonly system: System) {}

    //
    // Collection methods
    //

    async selectAll(schema_name: SchemaName, filter_data: FilterJson) {
        return this._run(schema_name, [], filter_data, SystemData.OP_SELECT);
    }

    async createAll(schema_name: SchemaName, change_data: ChangeData[]) {
        return this._run(schema_name, change_data, {}, SystemData.OP_CREATE);
    }

    async updateAll(schema_name: SchemaName, change_data: ChangeData[]) {
        return this._run(schema_name, change_data, {}, SystemData.OP_UPDATE);
    }

    async upsertAll(schema_name: SchemaName, change_data: ChangeData[]) {
        return this._run(schema_name, change_data, {}, SystemData.OP_UPSERT);
    }

    async deleteAll(schema_name: SchemaName, change_data: ChangeData[]) {
        return this._run(schema_name, change_data, {}, SystemData.OP_DELETE);
    }

    async selectOne(schema_name: SchemaName, filter_data: FilterJson): Promise<RecordInfo | undefined> {
        return this.selectAll(schema_name, filter_data).then(__head_one);
    }

    async select404(schema_name: SchemaName, change_data: FilterJson): Promise<RecordInfo> {
        return this.selectAll(schema_name, change_data).then(__head_404);
    }

    async selectIds(schema_name: SchemaName, filter_data: string[]): Promise<RecordInfo[]> {
        return this.selectAll(schema_name, {
            where: { id: { $in: filter_data } }
        });
    }

    async createOne(schema_name: SchemaName, change_data: ChangeData) {
        return this.createAll(schema_name, Array(change_data)).then(__head_one);
    }

    async updateOne(schema_name: SchemaName, change_data: ChangeData) {
        return this.updateAll(schema_name, Array(change_data)).then(__head_one);
    }

    async upsertOne(schema_name: SchemaName, change_data: ChangeData) {
        return this.upsertAll(schema_name, Array(change_data)).then(__head_one);
    }

    async deleteOne(schema_name: SchemaName, change_data: ChangeData) {
        return this.deleteAll(schema_name, Array(change_data)).then(__head_one);
    }

    //
    // Filter + Change ops
    //

    async updateAny(_schema_name: SchemaName, _filter_data: FilterJson, _change_data: ChangeData) {
        throw "Unimplemented";
    }

    async deleteAny(_schema_name: SchemaName, _filter_data: FilterJson) {
        throw "Unimplemented";
    }

    //
    // Internal functions
    //

    private async _run(schema_name: SchemaName, change_data: ChangeData[], filter_data: FilterJson, op: string): Promise<RecordInfo[]> {
        // let schema = this.system.meta.toSchema(schema_name);
        // let filter = schema.toFilter(filter_data);
        // let change = schema.toChange(change_data);

        // // Build a flow operation
        // let series = new FlowSeries(this.system, schema, change, filter, op);

        // // Initialize any missing data
        // await series.initialize();

        // // Cycle through the flow series rings
        // await series.run(Flow.RING_INIT);
        // await series.run(Flow.RING_PREP);
        // await series.run(Flow.RING_WORK);
        // await series.run(Flow.RING_POST);
        // await series.run(Flow.RING_DONE);

        // // Done
        // return series.change;

        return [];
    }
}