import _ from 'lodash';
import fs from 'fs-extra';

// Classes
import { Kernel } from "./system/kernels/kernel";
import { Object, ObjectType } from './system/classes/object';

export class MetaExport {
    readonly kernel = new Kernel();
    readonly base = './tmp/exports';

    async export() {
        await this.kernel.startup();

        // Console.warn
        console.warn('Exporting to:', this.base);

        // Clean out the target
        await fs.emptyDir(this.base);

        // Process
        for(let object of this.kernel.meta.objects) {
            let object_path = `./${ this.base }/system::object/${ object.system_name }.json`;
            let object_json = JSON.stringify(object.toJSON(), null, 4);

            console.info('object:', object.system_name);

            // Output the object data
            await fs.createFile(object_path);
            await fs.writeFile(object_path, object_json);

            // Process columns
            for(let column of _.values(object.columns)) {
                console.info('- column:', column.system_name);

                let column_path = `./${ this.base }/system::column/${ object.system_name }.${ column.system_name }.json`;
                let column_json = JSON.stringify(column.toJSON(), null, 4);

                // Output the column data
                await fs.createFile(column_path);
                await fs.writeFile(column_path, column_json);
            }

            // Don't export records for the two core types
            if (object.system_name === ObjectType.Object) {
                continue;
            }

            if (object.system_name === ObjectType.Column) {
                continue;
            }

            // Export records
            for(let record of await this.kernel.data.searchAny(object)) {
                console.info('- record:', record.data.id);

                let record_path = `./${ this.base }/${ object.system_name }/${ record.data.id }.json`;
                let record_json = JSON.stringify(_.omit(record.toJSON(), ['meta', 'acls']), null, 4);

                // Output the record data
                await fs.createFile(record_path);
                await fs.writeFile(record_path, record_json);
            }
        }

        // Done
        process.exit();
    }
}


// Run it
new MetaExport().export();