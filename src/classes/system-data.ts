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
import { FilterJson } from '../classes/filter';
import { SchemaName } from '../classes/schema';
import { Record } from '../classes/record';
import { RecordJson } from '../classes/record';
import { Observer } from '../classes/observer';
import { ObserverFlow } from '../classes/observer-flow';
import { System } from '../classes/system';

// Helpers
function __head_one(result: Record[]): Record | undefined {
    return _.head(result);
}

function __head_404(result: Record[]): Record {
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

    // Reference for future database usages
    constructor(private readonly system: System) {}

    async startup() {
        
    }

    //
    // Collection methods
    //

    async selectAll(schema_name: SchemaName, filter_data: FilterJson) {
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

    async selectOne(schema_name: SchemaName, filter_data: FilterJson): Promise<Record | undefined> {
        return this.selectAll(schema_name, filter_data).then(__head_one);
    }

    async select404(schema_name: SchemaName, change_data: FilterJson): Promise<Record> {
        return this.selectAll(schema_name, change_data).then(__head_404);
    }

    async selectIds(schema_name: SchemaName, filter_data: string[]): Promise<Record[]> {
        return this.selectAll(schema_name, {
            where: { id: { $in: filter_data } }
        });
    }

    async createOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this.createAll(schema_name, Array(change_data)).then(__head_one);
    }

    async updateOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this.updateAll(schema_name, Array(change_data)).then(__head_one);
    }

    async upsertOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this.upsertAll(schema_name, Array(change_data)).then(__head_one);
    }

    async deleteOne(schema_name: SchemaName, change_data: Partial<RecordJson>) {
        return this.deleteAll(schema_name, Array(change_data)).then(__head_one);
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
        let schema = this.system.meta.toSchema(schema_name);
        let filter = schema.toFilter(filter_data);
        let change = schema.toRecordSet(change_data);

        // Build the flow
        let flow = new ObserverFlow(this.system, schema, change, filter, op);

        // Initialize missing data
        await flow.initialize();

        // Cycle through the rings
        await flow.run(Observer.RING_INIT);
        await flow.run(Observer.RING_PREP);
        await flow.run(Observer.RING_WORK);
        await flow.run(Observer.RING_POST);
        await flow.run(Observer.RING_DONE);

        // Done
        return flow.change;
    }
}