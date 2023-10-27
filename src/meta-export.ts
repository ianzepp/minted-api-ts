import _ from 'lodash';
import fs from 'fs-extra';

// Classes
import { Kernel } from "@kernel/classes/kernel";
import { Object } from '@kernel/classes/object';
import { Column } from '@kernel/classes/column';
import { Record } from '@kernel/classes/record';

export class MetaExport {
    readonly kernel = new Kernel();
    readonly base = './tmp/exports';

    path(object_name, record_name) {
        return `./${ this.base }/${ object_name }/${ record_name }.json`;
    }

    async export() {
        await this.kernel.startup();

        await this.cleanupDirectory();
        await this.exportObjectList();
        
        await this.kernel.cleanup();

        // Done
        process.exit();
    }

    async cleanupDirectory() {
        return fs.emptyDir(this.base);
    }

    async exportObjectList() {
        for(let object of this.kernel.meta.objects) {
            await this.exportObject(object);
        }
    }

    async exportObject(object: Object) {
        await this.exportJson('system::object', object.system_name, object.toJSON());
        await this.exportColumnList(object);
        await this.exportRecordList(object);
    }

    async exportColumnList(object: Object) {
        for(let column of _.values(object.columns)) {
            await this.exportColumn(object, column);
        }        
    }

    async exportColumn(object: Object, column: Column) {
        await this.exportJson('system::column', `${ object.system_name }.${ column.system_name }`, column.toJSON());
    }

    async exportRecordList(object: Object) {
        // Don't export records for the two core types
        if (object.inherits('system::object')) {
            return;
        }

        if (object.inherits('system::column')) {
            return;
        }
        
        for(let record of await this.kernel.data.searchAny(object)) {
            await this.exportRecord(object, record);
        }
    }

    async exportRecord(object: Object, record: Record) {
        await this.exportJson(object.system_name, record.data.id, _.omit(record.toJSON(), ['meta', 'acls']));
    }

    async exportJson(object_name: string, record_name: string, json: object) {
        let record_path = this.path(object_name, record_name);
        let record_json = JSON.stringify(json, null, 4);
        await fs.createFile(record_path).then(() => fs.writeFile(record_path, record_json));
    }
}


// Run it
new MetaExport().export();