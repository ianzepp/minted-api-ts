import _ from 'lodash';
import Debug from 'debug';

// Classes
import { Filter } from '@system/classes/filter';
import { Kernel } from '@system/kernels/kernel';
import { Record } from '@system/classes/record';
import { Object } from '@system/classes/object';
import { SignalOp } from '@system/classes/signal';
import { SignalRunner } from '@src/system/classes/signal';

// Typedefs
import { ChangeData } from '@system/typedefs/record';
import { FilterJson } from '@system/typedefs/filter';
import { ObjectName } from '@system/typedefs/object';

// Data API errors
export class DataError extends Error {};
export class RecordFoundError extends DataError {};
export class RecordNotFoundError extends DataError {};

// Debug messages
const debug = Debug('minted:system:kernel-data');

// Local helper
function headOne<T>(result: T[]): T | undefined {
    return _.head(result);
}

// Throws and error if no results
function head404<T>(result: T[]): T {
    let r = _.head(result);

    if (r === undefined) {
        throw new Error('404');
    }

    return r;
}

export class KernelData {
    constructor(private readonly kernel: Kernel) {}

    async startup(): Promise<void> {

    }

    async cleanup(): Promise<void> {

    }

    //
    // Core runtime
    //

    async run(object_name: Object | ObjectName, change_data: ChangeData[], filter_data: Partial<FilterJson>, op: SignalOp): Promise<Record[]> {
        debug(`run(): op="${op}" object_name="${object_name}" change_data.length="${change_data.length}" with filter:`, filter_data);

        this.kernel.expect(change_data, 'change_data').an('array');
        this.kernel.expect(filter_data, 'filter_data').an('object');
        this.kernel.expect(op, 'op').a('string');

        let object = this.kernel.meta.lookup(object_name);
        let filter = new Filter(filter_data);

        // Is this something other than a select op, and the change data is empty?
        if (change_data.length === 0 && op !== SignalOp.Select) {
            return [];
        }

        // Convert the raw change data into records
        let change = change_data.map(change => object.toRecord(change));

        // Broadcast
        let runner = new SignalRunner();

        // Run and return the set of changes
        return runner.run({ kernel: this.kernel, object, change, filter, op });
    }
    
    //
    // Collection record methods
    //

    async selectAll(object_name: Object | ObjectName, source_data: ChangeData[]): Promise<Record[]> {
        let object = this.kernel.meta.lookup(object_name);
        let source = source_data.map(change => object.toRecord(change).data.id);

        return this.selectIds(object, _.uniq(_.compact(source)));
    }

    async createAll(object_name: Object | ObjectName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(object_name, change_data, {}, SignalOp.Create);
    }

    async updateAll(object_name: Object | ObjectName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(object_name, change_data, {}, SignalOp.Update);
    }

    async upsertAll(object_name: Object | ObjectName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(object_name, change_data, {}, SignalOp.Upsert);
    }

    async expireAll(object_name: Object | ObjectName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(object_name, change_data, {}, SignalOp.Expire);
    }

    async deleteAll(object_name: Object | ObjectName, change_data: ChangeData[]): Promise<Record[]> {
        return this.run(object_name, change_data, {}, SignalOp.Delete);
    }

    //
    // Single record methods
    //

    async selectOne(object_name: Object | ObjectName, source_data: ChangeData): Promise<Record | undefined> {
        return this.selectAll(object_name, [source_data]).then(headOne<Record>);
    }

    async createOne(object_name: Object | ObjectName, change_data: ChangeData): Promise<Record> {
        return this.createAll(object_name, [change_data]).then(headOne<Record>);
    }

    async updateOne(object_name: Object | ObjectName, change_data: ChangeData): Promise<Record> {
        return this.updateAll(object_name, [change_data]).then(headOne<Record>);
    }

    async upsertOne(object_name: Object | ObjectName, change_data: ChangeData): Promise<Record> {
        return this.upsertAll(object_name, [change_data]).then(headOne<Record>);
    }

    async expireOne(object_name: Object | ObjectName, change_data: ChangeData): Promise<Record> {
        return this.expireAll(object_name, [change_data]).then(headOne<Record>);
    }

    async deleteOne(object_name: Object | ObjectName, change_data: ChangeData): Promise<Record> {
        return this.deleteAll(object_name, [change_data]).then(headOne<Record>);
    }

    //
    // Search ops. Basically a `select` but with a filter to support a slightly different API
    // 

    async searchAny(object_name: Object | ObjectName, where?: _.Dictionary<any>, order?: _.Dictionary<string>, limit?: number): Promise<Record[]> {
        return this.selectAny(object_name, { where: where, order: order, limit: limit });
    }

    async searchOne(object_name: Object | ObjectName, where?: _.Dictionary<any>, order?: _.Dictionary<string>): Promise<Record | undefined> {
        return this.selectAny(object_name, { where: where, order: order, limit: 1 }).then(headOne);
    }

    async search404(object_name: Object | ObjectName, where?: _.Dictionary<any>, order?: _.Dictionary<string>): Promise<Record> {
        return this.selectAny(object_name, { where: where, order: order, limit: 1 }).then(head404);
    }

    async searchNew(object_name: Object | ObjectName, created_at: string): Promise<Record[]> {
        return this.searchAny(object_name, { created_at: { $gt: created_at }}, { created_at: 'asc' });
    }

    //
    // Lookup a record by the record name
    // 

    async lookupAny(object_name: Object | ObjectName, record_name: string, limit?: number): Promise<Record[]> {
        return this.selectAny(object_name, { where: { name: record_name }, limit: limit });
    }

    async lookupOne(object_name: Object | ObjectName, record_name: string): Promise<Record | undefined> {
        return this.selectAny(object_name, { where: { name: record_name }, limit: 1 }).then(headOne);
    }

    async lookup404(object_name: Object | ObjectName, record_name: string): Promise<Record> {
        return this.selectAny(object_name, { where: { name: record_name }, limit: 1 }).then(head404);
    }

    //
    // Filter + Change ops
    //

    async selectAny(object_name: Object | ObjectName, filter_data: Partial<FilterJson> = {}): Promise<Record[]> {
        return this.run(object_name, [], filter_data, SignalOp.Select);
    }

    async updateAny(object_name: Object | ObjectName, filter_data: Partial<FilterJson>, change_data: ChangeData): Promise<Record[]> {
        return this.selectAny(object_name, filter_data).then(result => {
            result.forEach(record => _.assign(record.data, change_data));
            return this.updateAll(object_name, result);
        });
    }

    async expireAny(object_name: Object | ObjectName, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.selectAny(object_name, filter_data).then(result => this.expireAll(object_name, result));
    }

    async deleteAny(object_name: Object | ObjectName, filter_data: Partial<FilterJson>): Promise<Record[]> {
        return this.selectAny(object_name, filter_data).then(result => this.deleteAll(object_name, result));
    }

    //
    // By a single record ID
    //

    async select404(object_name: Object | ObjectName, record_one: string): Promise<Record> {
        return this.selectIds(object_name, [record_one]).then(head404<Record>);
    }

    async update404(object_name: Object | ObjectName, record_one: string, change_data: ChangeData): Promise<Record> {
        throw new Error('Unimplemented');
    }

    async expire404(object_name: Object | ObjectName, record_one: string): Promise<Record> {
        return this.select404(object_name, record_one).then(result => this.expireOne(object_name, result));
    }

    async delete404(object_name: Object | ObjectName, record_one: string): Promise<Record> {
        return this.select404(object_name, record_one).then(result => this.deleteOne(object_name, result));
    }

    //
    // By an array of record IDs
    //

    async selectIds(object_name: Object | ObjectName, record_ids: string[]): Promise<Record[]> {
        return this.selectAny(object_name, { where: { id: record_ids }});
    }

    async updateIds(object_name: Object | ObjectName, record_ids: string[], change_data: ChangeData): Promise<Record[]> {
        return this.updateAny(object_name, { where: { id: record_ids }}, change_data);
    }

    async expireIds(object_name: Object | ObjectName, record_ids: string[]): Promise<Record[]> {
        return this.expireAny(object_name, { where: { id: record_ids }});
    }

    async deleteIds(object_name: Object | ObjectName, record_ids: string[]): Promise<Record[]> {
        return this.deleteAny(object_name, { where: { id: record_ids }});
    }
}