import _ from 'lodash';

// Classes
import { Filter } from '@classes/filter';
import { Schema } from '@classes/schema';
import { Column } from '@classes/column';
import { Record } from '@classes/record';
import { Kernel } from '@classes/kernel';
import { toJSON } from '@classes/helpers';

// Typedefs
import { Service } from '@typedefs/kernel';
import { ChangeData, RecordFlat } from '@typedefs/record';
import { SchemaName, SchemaType } from '@typedefs/schema';

// Implementation
export class KernelAcls implements Service {
    constructor(private readonly kernel: Kernel) {}

    async startup(): Promise<void> {}
    async cleanup(): Promise<void> {}

    async upsertOne(schema_name: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        // return this.upsertAll(schema_name, [change_data]).then(headOne<Record>);
    }

    async deleteOne(schema_name: Schema | SchemaName, change_data: ChangeData): Promise<Record> {
        // return this.deleteAll(schema_name, [change_data]).then(headOne<Record>);
    }

}
