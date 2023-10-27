// lodash
import _ from 'lodash';
import { toLower } from 'lodash';

// Debugging
const debug = require('debug')('minted:kernel:meta');

// Kernels
import { Kernel } from '@kernel/classes/kernel';

// Classes
import { Column } from '@kernel/classes/column';
import { Object } from '@kernel/classes/object';

export class KernelMetaMap<T> extends Map<string, T> {
    get(rn: string) {
        return super.get(this.prefix(rn));
    }

    set(rn: string, data: T) {
        return super.set(this.prefix(rn), data);
    }

    delete(rn: string) {
        return super.delete(this.prefix(rn));
    }

    prefix(rn: string) {
        return toLower(/::/.test(rn) ? rn : `system::${ rn }`);
    }
}

// Implementation
export class KernelMeta {
    private readonly objects_map = new KernelMetaMap<Object>();
    private readonly columns_map = new KernelMetaMap<Column[]>();

    constructor(private readonly kernel: Kernel) {}

    get objects() {
        return Array.from(this.objects_map.values());
    }

    get object_keys() {
        return Array.from(this.objects_map.keys()).sort();
    }

    get columns() {
        return _.flatten(Array.from(this.columns_map.values()));
    }

    async startup(): Promise<void> {
        // Select the raw objects and columns
        let object_list = await this.kernel.knex.selectTo('system::object');
        let column_list = await this.kernel.knex.selectTo('system::column');

        // Process objects
        _.each(object_list, object_data => this.registerObject(object_data));

        // Process columns for each object
        _.each(column_list, column_data => this.registerColumn(column_data));

        // Done
        debug('startup() done, registered:', this.object_keys);
    }
    
    async cleanup(): Promise<void> {
        this.objects_map.clear();
        this.columns_map.clear();
    }

    async refresh() {
        await this.cleanup();
        await this.startup();
    }

    registerObject(object_data: _.Dictionary<any>) {
        let object = new Object(object_data);

        // Save to mapping
        this.objects_map.set(object.system_name, object);
        this.columns_map.set(object.system_name, []);

        debug('registerObject()', object.system_name);
    }

    registerColumn(column_data: _.Dictionary<any>) {
        let column = new Column(column_data);
        let object = this.get(column.object_name);

        // Save to object
        object.columns[column.column_name] = column;

        // Save to mapping
        this.columns_map.get(object.system_name).push(column);

        debug('registerColumn()', object.system_name, column.system_name);    
    }

    exists(object_name: string) {
        return this.get(object_name) !== undefined;
    }

    get(object_name: string): Object | undefined {
        return this.objects_map.get(object_name);
    }

    delete(object_name: string) {
        return this.objects_map.delete(object_name);
    }

    lookup(object: Object | string): Object {
        let object_name: string;

        if (typeof object === 'string') {
            object_name = object;
            object = this.get(object_name);
        }

        if (object instanceof Object) {
            return object;
        }

        throw new Error(`Object "${ object_name }" not found or is not visible`);
    }
}
