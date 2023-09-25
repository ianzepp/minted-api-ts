import _ from 'lodash';

// Classes
import { Observer } from '@classes/observer';
import { Signal } from '@classes/signal';
import { Record } from '@classes/record';

// Typedefs
import { ObserverRing } from '@typedefs/observer';
import { SchemaType } from '@typedefs/schema';
import { Column } from '@classes/column';


export default class extends Observer {
    toName(): string {
        return __filename;
    }
    
    onSchema(): string {
        return SchemaType.Column;
    }

    onRing(): ObserverRing {
        return ObserverRing.Post;
    }

    onDelete(): boolean {
        return true;
    }

    async run(signal: Signal): Promise<void> {
        await Promise.all(signal.change.map(record => this.one(signal, record)));
    }

    async one(signal: Signal, record: Record) {
        // Create temporary refs
        let column = Column.from(record.data);
        let schema = signal.kernel.meta.schemas.get(column.schema_name);

        await signal.kernel.knex.schema.table(`${schema.name}/data`, t => {            
            return t.dropColumn(column.column_name);
        });

        // Delete the column data from the parent schema
        schema.remove(column);

        // Delete the column data from the kernel metadata
        signal.kernel.meta.columns.delete(column.name);
    }
}
