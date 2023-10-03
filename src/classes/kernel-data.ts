import _ from 'lodash';
import { v4 as uuid } from 'uuid';

// Knex stuff
import knex from 'knex';
import { Knex } from 'knex';

// Classes
import { Filter } from '@classes/filter';
import { Kernel } from '@classes/kernel';
import { Record } from '@classes/record';
import { Object } from '@classes/object';
import { Signal } from '@classes/signal';

// Typedefs
import { ChangeData } from '@typedefs/record';
import { FilterJson } from '@typedefs/filter';
import { Service } from '@typedefs/kernel';
import { NeuronRing } from '@typedefs/neuron';
import { ObjectName } from '@typedefs/object';
import { SignalOp } from '@typedefs/signal';

// Data API errors
export class DataError extends Error {};
export class RecordFoundError extends DataError {};
export class RecordNotFoundError extends DataError {};
export class RecordColumnImmutableError extends DataError {};
export class RecordColumnRequiredError extends DataError {};

// Create the driver reference
export const KnexConfig = {
    client: Bun.env.KNEX_CLIENT,
    connection: {
        host:     Bun.env.KNEX_HOST,
        port:     Bun.env.KNEX_PORT,
        user:     Bun.env.KNEX_USER,
        password: Bun.env.KNEX_PASSWORD,
        database: Bun.env.KNEX_DATABASE,
        filename: Bun.env.KNEX_FILENAME,
        acquireConnectionTimeout: 10000,
    },
    pool: {
        min: 0,
        max: 10
    },
    useNullAsDefault: true,
};

// SSL required?
if (Bun.env.KNEX_ENCRYPT === 'true' && Bun.env.KNEX_CLIENT === 'postgres') {
    _.set(KnexConfig, 'connection.ssl', { rejectUnauthorized: false });
}

if (Bun.env.KNEX_ENCRYPT === 'true' && Bun.env.KNEX_CLIENT === 'mssql') {
    _.set(KnexConfig, 'options.encrypt', true);
}

// Create the app-wide connection
export const KnexDriver = knex(KnexConfig);

// Local helper
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
    public db: Knex = KnexDriver;
    public tx: Knex.Transaction | undefined;
    public readonly uuid = uuid;

    constructor(private readonly kernel: Kernel) {}

    async startup(): Promise<void> {
        if (this.kernel.isTest()) {
            this.db = knex(KnexConfig);
        }
    }

    async cleanup(): Promise<void> {
        if (this.kernel.isTest()) {
            await this.db.destroy();
        }
    }

    //
    // Transaction support
    //

    async transaction() {
        this.tx = await this.db.transaction();
    }

    async commit() {
        if (this.tx && this.tx.isCompleted() === false) {
            await this.tx.commit();
        }

        this.tx = undefined;
    }

    async revert() {
        if (this.tx && this.tx.isCompleted() === false) {
            await this.tx.rollback();
        }

        this.tx = undefined;
    }

    //
    // Direct access
    //
    
    get driver(): Knex {
        return this.tx ?? this.db;
    }

    get schema(): Knex.SchemaBuilder {
        return this.driver.schema;
    }

    get fn() {
        return this.driver.fn;
    }

    //
    // Direct DB/TX methods
    //

    driverTo(object_name: string, type: 'data' | 'meta' | 'acls '= 'data') {
        let knex: Knex.QueryBuilder;

        if (type === 'data') {
            knex = this.driver(`${ object_name } as ${ type }`);
        }

        else {
            knex = this.driver(`${ object_name }::${ type } as ${ type }`);
        }

        // if (this.kernel.isRoot() === false) {
        //     knex = knex.whereIn(`${ type }.ns`, this.kernel.auth.namespaces);
        // }

        return knex;
    }
    
    selectTo(object_name: string) {
        let knex = this
            .driver({ data: `${ object_name }` })
            .leftJoin({ meta: `${ object_name }::meta` }, 'meta.id', 'data.id')
            .leftJoin({ acls: `${ object_name }::acls` }, 'acls.id', 'data.id');

        // if (this.kernel.isRoot() === false) {
        //     knex = knex.whereIn(`data.ns`, this.kernel.auth.namespaces);
        // }

        return knex;
    }
    //
    // Core runtime
    //

    async run(object_name: Object | ObjectName, change_data: ChangeData[], filter_data: Partial<FilterJson>, op: SignalOp): Promise<Record[]> {
        if (Bun.env.POSTGRES_DEBUG === 'true') {
            console.debug(`KernelData.run(): op="${op}" object_name="${object_name}" change_data.length="${change_data.length}" with filter:`, filter_data);
        }

        this.kernel.expect(change_data, 'change_data').an('array');
        this.kernel.expect(filter_data, 'filter_data').an('object');
        this.kernel.expect(op, 'op').a('string');

        let object = this.kernel.meta.objects.get(object_name);
        let filter = new Filter(filter_data);

        // Is this something other than a select op, and the change data is empty?
        if (change_data.length === 0 && op !== SignalOp.Select) {
            return [];
        }

        // Convert the raw change data into records
        let change = change_data.map(change => object.toRecord(change));

        // Build the signal
        let signal = new Signal(this.kernel, object, change, filter, op);

        // Cycle through rings 0 - 9
        for (let ring = 0 as NeuronRing; ring <= 9; ring++) {
            await signal.run(ring);
        }

        // Done
        return signal.change;
    }
    
    //
    // Collection record methods
    //

    async selectAll(object_name: Object | ObjectName, source_data: ChangeData[]): Promise<Record[]> {
        let object = this.kernel.meta.objects.get(object_name);
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

    async searchAny(object_name: Object | ObjectName, filter_data: Partial<FilterJson> = {}): Promise<Record[]> {
        return this.selectAny(object_name, filter_data);
    }

    async searchOne(object_name: Object | ObjectName, filter_data: Partial<FilterJson> = {}): Promise<Record | undefined> {
        return this.selectAny(object_name, filter_data).then(headOne);
    }

    async search404(object_name: Object | ObjectName, filter_data: Partial<FilterJson> = {}): Promise<Record> {
        return this.selectAny(object_name, filter_data).then(head404);
    }

    async searchNot(object_name: Object | ObjectName, filter_data: Partial<FilterJson> = {}): Promise<void> {
        return this.selectAny(object_name, filter_data).then(headNot);
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
    // By ID or IDs
    //

    async select404(object_name: Object | ObjectName, record_one: string): Promise<Record> {
        return this.selectAny(object_name, { where: { id: record_one }}).then(head404<Record>);
    }

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