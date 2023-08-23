
import { FilterJson } from './filter';
import { FilterInfo } from './filter';
import { RecordInfo } from './record';
import { ChangeData } from './record';

export type SchemaName = string;
export type SchemaType = SchemaInfo | SchemaName;

export interface SchemaInfo {
    readonly name: string;
    readonly description: string | null;
}