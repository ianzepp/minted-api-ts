// lodash
import _ from 'lodash';
import { toLower } from 'lodash';

// Kernels
import { Kernel } from '@kernels/kernel';

// Classes
import { Column } from '@classes/column';
import { Object } from '@classes/object';
import { ObjectType } from '@typedefs/object';

// Helpers
import { assertReturn } from '@classes/helper';

// Extract the predefined list of object names
export const KernelObjectTypes = _.values(ObjectType) as string[];

// Object map does automatic case management
function toSystemName(object_name: string) {
    if (object_name && object_name.includes('::') === false) {
        object_name = 'system::' + object_name;
    }

    return toLower(object_name);
}

class ObjectMap extends Map<string, Object> {
    get(object_name: string) {
        return super.get(toSystemName(object_name));
    }

    set(object_name: string, object: Object) {
        return super.set(toSystemName(object_name), object);
    }

    delete(object_name: string) {
        return super.delete(toSystemName(object_name));
    }
}

// Implementation
export class KernelMeta {
    private readonly objects_map = new ObjectMap();

    constructor(private readonly kernel: Kernel) {}

    get objects() {
        return Array.from(this.objects_map.values());
    }

    get object_keys() {
        return Array.from(this.objects_map.keys());
    }

    async startup(): Promise<void> {
        // Select the raw objects and columns
        let object_list = await this.kernel.knex.selectTo('system::object');
        let column_list = await this.kernel.knex.selectTo('system::column');

        // Process objects
        _.each(object_list, object_data => this.addObject(object_data));

        // Process columns for each object
        _.each(column_list, column_data => this.addColumn(column_data));
    }
    
    async cleanup(): Promise<void> {
        this.objects_map.clear();
    }

    async refresh() {
        await this.cleanup();
        await this.startup();
    }

    addObject(object_data: _.Dictionary<any>) {
        let object = Object.from(object_data);

        // Save to map
        this.objects_map.set(object.system_name, object);    
    }

    addColumn(column_data: _.Dictionary<any>) {
        let column = Column.from(column_data);
        let object = this.get(column.object_name);

        // Save to object
        object.add(column);
    
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

        if (object instanceof Object) {
            return object;
        }

        if (typeof object === 'string') {
            object_name = object;
            object = this.get(object_name);
        }
        
        return assertReturn(object, `Object "${ object_name }" not found or is not visible`);
    }

}
