import chai from 'chai';

// Classes
import { Database } from '../database';
import { DatabaseHelper } from '../database';
import { Observer, ObserverRing } from '../classes/observer';

export default class extends Observer {
    toName() {
        return 'record.data-create';
    }
    
    onSchema() {
        return 'record';
    }

    onRing() {
        return Observer.RING_WORK;
    }

    onCreate() {
        return true;
    }

    toColumnSet() {
    }

    toDataColumnSet() {
        return new DatabaseHelper.ColumnSet([
            'id',
            'ns',
            'name'
        ], {
            table: this.schema.name
        });
    }

    toInfoColumnSet() {
        return new DatabaseHelper.ColumnSet([
            'id',
            'created_at',
            'created_by'
        ], {
            table: this.schema.name
        });
    }

    async run() {
        chai.expect(this.change).not.empty;

        // Setup for changes
        let created_at = this.system.now();
        let created_by = this.system.options.user_id || null;

        // Generate properties for each record
        this.change.forEach(record => {
            record.data.id = this.system.toId();
            record.data.ns = null;
            record.info.created_at = created_at;
            record.info.created_by = created_by;
        });

        // Split the records
        let record_data = this.change.map(r => r.data);
        let record_info = this.change.map(r => r.info);

        // Generate a column set
        let columns = this.system.meta.toColumnsOf(this.schema.name).map(c => c.column_name);

        // Push record columns
        columns.push('id', 'ns');

        // Build the column set
        let columns_set = new DatabaseHelper.ColumnSet(columns, {
            table: this.schema.name
        });

        // Create the insert queries
        await Database.none(DatabaseHelper.insert(record_data, columns_set));
    }
}