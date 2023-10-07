import _ from 'lodash';

//
// Types
//

import { toLower } from "lodash";

/**
 * Represents the name of a column.
 */
export type ColumnName = string;

/**
 * Represents the column names in the meta.
 */
export const ColumnsMeta = [
    'created_at',
    'created_by',
    'updated_at',
    'updated_by',
    'expired_at',
    'expired_by',
    'deleted_at',
    'deleted_by',
];

/**
 * Represents the column names in the acls.
 */
export const ColumnsAcls = [
    'access_full',
    'access_edit',
    'access_read',
    'access_deny',
];

//
// Enums
//

/**
 * Enum for different forms a column can take.
 */
export enum ColumnForm {
    Audited = 'audited',    // The column is audited
    Immutable = 'immutable', // The column is immutable
    Indexed = 'indexed', // The column is indexed
    Internal = 'internal', // The column is internal
    Required = 'required', // The column is required
    Unique = 'unique', // The column is unique
}

/**
 * Enum for different types a column can be.
 */
export enum ColumnType {
    Boolean = 'boolean', // The column is of boolean type
    Decimal = 'decimal', // The column is of decimal type
    Enum = 'enum', // The column is of enum type
    Integer = 'integer', // The column is of integer type
    Json = 'json', // The column is of JSON type
    Text = 'text', // The column is of text type
}

export const ColumnTypeKeys = _.keys(ColumnType).map(_.toLower);
