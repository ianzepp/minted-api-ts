[minted-api](../README.md) / [Exports](../modules.md) / layouts/record

# Module: layouts/record

## Table of contents

### Interfaces

- [RecordAcls](../interfaces/layouts_record.RecordAcls.md)
- [RecordData](../interfaces/layouts_record.RecordData.md)
- [RecordFlat](../interfaces/layouts_record.RecordFlat.md)
- [RecordInfo](../interfaces/layouts_record.RecordInfo.md)
- [RecordJson](../interfaces/layouts_record.RecordJson.md)
- [RecordMeta](../interfaces/layouts_record.RecordMeta.md)

### Type Aliases

- [ChangeData](layouts_record.md#changedata)
- [Datetime](layouts_record.md#datetime)
- [UUID](layouts_record.md#uuid)

## Type Aliases

### ChangeData

Ƭ **ChangeData**: [`RecordFlat`](../interfaces/layouts_record.RecordFlat.md) \| [`RecordData`](../interfaces/layouts_record.RecordData.md) \| [`RecordJson`](../interfaces/layouts_record.RecordJson.md)

Defines the allowable types for database change operations.

#### Defined in

[src/layouts/record.ts:13](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L13)

___

### Datetime

Ƭ **Datetime**: `Date` \| `string` \| ``null``

Defines the types allowed for date-related fields.

#### Defined in

[src/layouts/record.ts:16](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L16)

___

### UUID

Ƭ **UUID**: `string`

...

#### Defined in

[src/layouts/record.ts:19](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L19)
