[minted-api](../README.md) / [Exports](../modules.md) / [layouts/record](../modules/layouts_record.md) / RecordMeta

# Interface: RecordMeta

[layouts/record](../modules/layouts_record.md).RecordMeta

Represents the metadata of the record.

## Table of contents

### Properties

- [created\_at](layouts_record.RecordMeta.md#created_at)
- [created\_by](layouts_record.RecordMeta.md#created_by)
- [deleted\_at](layouts_record.RecordMeta.md#deleted_at)
- [deleted\_by](layouts_record.RecordMeta.md#deleted_by)
- [expired\_at](layouts_record.RecordMeta.md#expired_at)
- [expired\_by](layouts_record.RecordMeta.md#expired_by)
- [updated\_at](layouts_record.RecordMeta.md#updated_at)
- [updated\_by](layouts_record.RecordMeta.md#updated_by)

## Properties

### created\_at

• **created\_at**: `Date`

Timestamp when the record was created.

#### Defined in

[src/layouts/record.ts:38](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L38)

___

### created\_by

• **created\_by**: `string`

User ID that created the record.

#### Defined in

[src/layouts/record.ts:41](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L41)

___

### deleted\_at

• **deleted\_at**: [`Datetime`](../modules/layouts_record.md#datetime)

Timestamp when the record was deleted, or `null` if the record was not deleted

#### Defined in

[src/layouts/record.ts:56](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L56)

___

### deleted\_by

• **deleted\_by**: `string`

User ID that deleted the record, or `null` if the record was not deleted

#### Defined in

[src/layouts/record.ts:59](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L59)

___

### expired\_at

• **expired\_at**: [`Datetime`](../modules/layouts_record.md#datetime)

Timestamp when the record was expired.

#### Defined in

[src/layouts/record.ts:50](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L50)

___

### expired\_by

• **expired\_by**: `string`

User ID that expired the record, or `null` if the record was not expired.

#### Defined in

[src/layouts/record.ts:53](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L53)

___

### updated\_at

• **updated\_at**: [`Datetime`](../modules/layouts_record.md#datetime)

Timestamp when the record was updated.

#### Defined in

[src/layouts/record.ts:44](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L44)

___

### updated\_by

• **updated\_by**: `string`

User ID that created the record, or the last User ID to update the record.

#### Defined in

[src/layouts/record.ts:47](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L47)
