//
// Enums
//

/**
 * Enum for thread operations.
 * @enum {string}
 */
export enum SignalOp {
    Create = 'create',
    Delete = 'delete',
    Expire = 'expire',
    Select = 'select',
    Update = 'update',
    Upsert = 'upsert',
}
