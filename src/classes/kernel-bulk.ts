import _ from 'lodash';
import chai from 'chai';

import { ChangeData } from "@typedefs/record";
import { FilterJson } from "@typedefs/filter";
import { Kernel } from "@classes/kernel";
import { toJSON } from "./helper";

// Bulk request payload
export interface BulkOp {
    method: string;
    object: string;
    filter?: Partial<FilterJson>;
    inputs?: unknown;
    result?: unknown;
}

// Bulk request methods
export enum BulkMethod {
    // Select
    SelectAll = 'select-all',
    SelectOne = 'select-one',
    SelectIds = 'select-ids',
    Select404 = 'select-404',

    // Select
    SearchAny = 'search-any',
    SearchOne = 'search-one',
    Search404 = 'search-404',
    SearchNot = 'search-not',

    // Create
    CreateAll = 'create-all',
    CreateOne = 'create-one',

    // Update
    UpdateAll = 'update-all',
    UpdateOne = 'update-one',

    // Upsert
    UpsertAll = 'upsert-all',
    UpsertOne = 'upsert-one',

    // Expire
    ExpireAll = 'expire-all',
    ExpireOne = 'expire-one',

    // Delete
    DeleteAll = 'delete-all',
    DeleteOne = 'delete-one',
}

// Implementation
export class KernelBulk {
    // Constructor
    constructor(private readonly kernel: Kernel) {}

    // Required but unimplemented
    async startup() {}
    async cleanup() {}

    // Process
    async process(operations: BulkOp[]) {
        for(let bulk of operations) {
            // Sanity
            this.expect(bulk).an('object');
            this.expect(bulk).property('method').string;
            this.expect(bulk).property('object').string;

            //
            // Select methods
            //

            if (bulk.method === BulkMethod.SelectAll) {
                this.expect(bulk).property('inputs').a('array');
                this.expectEach(bulk.inputs, item => chai.expect(item).a('object'));
                bulk.result = await this.kernel.data.selectAll(bulk.object, bulk.inputs as ChangeData[]);
            }
            
            if (bulk.method === BulkMethod.SelectOne) {
                this.expect(bulk).property('inputs').a('object');
                bulk.result = await this.kernel.data.selectOne(bulk.object, bulk.inputs as ChangeData);
            }

            if (bulk.method === BulkMethod.SelectIds) {
                this.expect(bulk).property('inputs').a('array');
                this.expectEach(bulk.inputs, item => chai.expect(item).a('string'));
                bulk.result = await this.kernel.data.selectIds(bulk.object, bulk.inputs as string[]);
            }

            if (bulk.method === BulkMethod.Select404) {
                this.expect(bulk).property('inputs').a('string');
                bulk.result = await this.kernel.data.select404(bulk.object, bulk.inputs as string);
            }

            //
            // Search methods
            //

            if (bulk.method === BulkMethod.SearchAny) {
                this.expect(bulk).property('filter').a('object');
                this.expect(bulk).not.property('inputs');
                bulk.result = await this.kernel.data.searchAny(bulk.object, bulk.filter);
            }
            
            if (bulk.method === BulkMethod.SelectOne) {
                this.expect(bulk).property('filter').a('object');
                this.expect(bulk).not.property('inputs');
                bulk.result = await this.kernel.data.searchOne(bulk.object, bulk.filter);
            }

            if (bulk.method === BulkMethod.Select404) {
                this.expect(bulk).property('filter').a('object');
                this.expect(bulk).not.property('inputs');
                bulk.result = await this.kernel.data.search404(bulk.object, bulk.filter);
            }

            if (bulk.method === BulkMethod.SearchNot) {
                this.expect(bulk).property('filter').a('object');
                this.expect(bulk).not.property('inputs');
                bulk.result = await this.kernel.data.searchNot(bulk.object, bulk.filter);
            }

            //
            // Create methods
            //
            
            if (bulk.method === BulkMethod.CreateAll) {
                this.expect(bulk).property('inputs').a('array');
                this.expectEach(bulk.inputs, item => chai.expect(item).a('object'));
                bulk.result = await this.kernel.data.createAll(bulk.object, bulk.inputs as ChangeData[]);
            }
            
            if (bulk.method === BulkMethod.CreateOne) {
                this.expect(bulk).property('inputs').a('object');
                bulk.result = await this.kernel.data.createOne(bulk.object, bulk.inputs as ChangeData);
            }

            //
            // Update methods
            //
            
            if (bulk.method === BulkMethod.UpdateAll) {
                this.expect(bulk).property('inputs').a('array');
                this.expectEach(bulk.inputs, item => chai.expect(item).a('object'));
                bulk.result = await this.kernel.data.updateAll(bulk.object, bulk.inputs as ChangeData[]);
            }
            
            if (bulk.method === BulkMethod.UpdateOne) {
                this.expect(bulk).property('inputs').a('object');
                bulk.result = await this.kernel.data.updateOne(bulk.object, bulk.inputs as ChangeData);
            }

            //
            // Expire methods
            //
            
            if (bulk.method === BulkMethod.ExpireAll) {
                this.expect(bulk).property('inputs').a('array');
                this.expectEach(bulk.inputs, item => chai.expect(item).a('object'));
                bulk.result = await this.kernel.data.expireAll(bulk.object, bulk.inputs as ChangeData[]);
            }
            
            if (bulk.method === BulkMethod.ExpireOne) {
                this.expect(bulk).property('inputs').a('object');
                bulk.result = await this.kernel.data.expireOne(bulk.object, bulk.inputs as ChangeData);
            }

            //
            // Delete methods
            //
            
            if (bulk.method === BulkMethod.DeleteAll) {
                this.expect(bulk).property('inputs').a('array');
                this.expectEach(bulk.inputs, item => chai.expect(item).a('object'));
                bulk.result = await this.kernel.data.deleteAll(bulk.object, bulk.inputs as ChangeData[]);
            }
            
            if (bulk.method === BulkMethod.DeleteOne) {
                this.expect(bulk).property('inputs').a('object');
                bulk.result = await this.kernel.data.deleteOne(bulk.object, bulk.inputs as ChangeData);
            }

            // Remove the inputs and filter from the response data
            delete bulk.filter;
            delete bulk.inputs;
        }

        // Convert to pure JSON and return
        return toJSON(operations);
    }

    //
    // Helpers
    //

    private expect(val: any, message?: string) {
        return chai.expect(val, message);
    }

    private expectEach(val: any, testerFn: (val: any, message?: string) => void) {
        return _.each(val as any[], testerFn);
    }

}