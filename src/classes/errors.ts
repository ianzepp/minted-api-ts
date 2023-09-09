

// Data API errors
export class DataError extends Error {};
export class RecordNotFoundError extends DataError {};
export class RecordColumnImmutableError extends DataError {};
export class RecordColumnRequiredError extends DataError {};

// Meta API errors
export class MetaError extends Error {};
export class SchemaNotFoundError extends MetaError {};
export class ColumnNotFoundError extends MetaError {};

// User API errors
export class UserError extends Error {};
export class UserNotFoundError extends UserError {};
export class UserClientNotActiveError extends UserError {};



