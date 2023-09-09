[minted-api](../README.md) / [Exports](../modules.md) / [layouts/record](../modules/layouts_record.md) / RecordJson

# Interface: RecordJson

[layouts/record](../modules/layouts_record.md).RecordJson

Represents the record's JSON representation in object format.

## Hierarchy

- **`RecordJson`**

  ↳ [`RecordInfo`](layouts_record.RecordInfo.md)

## Implemented by

- [`Record`](../classes/classes_record.Record.md)

## Table of contents

### Properties

- [acls](layouts_record.RecordJson.md#acls)
- [data](layouts_record.RecordJson.md#data)
- [meta](layouts_record.RecordJson.md#meta)
- [type](layouts_record.RecordJson.md#type)

## Properties

### acls

• **acls**: [`RecordAcls`](layouts_record.RecordAcls.md)

Accessor to the set of access control list data.

#### Defined in

[src/layouts/record.ts:89](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L89)

___

### data

• **data**: [`RecordData`](layouts_record.RecordData.md)

Accessor to the key/value mapping of record properties with their values.

#### Defined in

[src/layouts/record.ts:83](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L83)

___

### meta

• **meta**: [`RecordMeta`](layouts_record.RecordMeta.md)

Accessor to the set of timestamp and access information describing this record.

#### Defined in

[src/layouts/record.ts:86](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L86)

___

### type

• **type**: `string`

Returns the string name of the parent schema type.

#### Defined in

[src/layouts/record.ts:80](https://github.com/ianzepp/minted-api-ts/blob/05123f2/src/layouts/record.ts#L80)
