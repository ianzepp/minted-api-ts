[minted-api](../README.md) / [Exports](../modules.md) / [layouts/record](../modules/layouts_record.md) / RecordJson

# Interface: RecordJson

[layouts/record](../modules/layouts_record.md).RecordJson

Represents the record's JSON representation in object format.

## Hierarchy

- **`RecordJson`**

  ↳ [`RecordInfo`](layouts_record.RecordInfo.md)

## Table of contents

### Properties

- [data](layouts_record.RecordJson.md#data)
- [meta](layouts_record.RecordJson.md#meta)
- [type](layouts_record.RecordJson.md#type)

## Properties

### data

• **data**: [`RecordData`](layouts_record.RecordData.md)

Accessor to the key/value mapping of record properties with their values.

#### Defined in

[src/layouts/record.ts:82](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/layouts/record.ts#L82)

___

### meta

• **meta**: [`RecordMeta`](layouts_record.RecordMeta.md)

Accessor to the set of timestamp and access information describing this record.

#### Defined in

[src/layouts/record.ts:85](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/layouts/record.ts#L85)

___

### type

• **type**: `string`

Returns the string name of the parent schema type.

#### Defined in

[src/layouts/record.ts:79](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/layouts/record.ts#L79)
