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
class ObjectMap extends Map<string, Object> {
    get(object_name: string) {
        return super.get(toLower(object_name));
    }

    set(object_name: string, object: Object) {
        return super.set(toLower(object_name), object);
    }

    delete(object_name: string) {
        return super.delete(toLower(object_name));
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
        let object_list = await this.kernel.knex.selectTo(ObjectType.Object);
        let column_list = await this.kernel.knex.selectTo(ObjectType.Column);

        // Process objects
        for(let object_flat of object_list) {
            let object = Object.from(object_flat);

            // Save to map
            this.objects_map.set(object.object_name, object);
        }

        // Process columns for each object
        for(let column_flat of column_list) {
            let column = Column.from(column_flat);
            let object = this.objects_map.get(column.object_name);

            // Save to object
            object.add(column);
        }
    }
    
    async cleanup(): Promise<void> {
        this.objects_map.clear();
    }

    async refresh() {
        await this.cleanup();
        await this.startup();
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

    lookup(target: Object | string): Object {
        // If we are passed an object, re-resolve it to ensure it isn't a stale cache hit
        if (target instanceof Object) {
            target = target.object_name;
        }
        
        return assertReturn<any>(target, `404: Object "${ target }" not found or is not visible`);
    }

}
