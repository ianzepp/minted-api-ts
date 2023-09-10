[minted-api](../README.md) / [Exports](../modules.md) / [layouts/record](../modules/layouts_record.md) / RecordInfo

# Interface: RecordInfo

[layouts/record](../modules/layouts_record.md).RecordInfo

Represents the architecture needed to obtain a record's info.

## Hierarchy

- [`RecordJson`](layouts_record.RecordJson.md)

  ↳ **`RecordInfo`**

## Table of contents

### Properties

- [acls](layouts_record.RecordInfo.md#acls)
- [data](layouts_record.RecordInfo.md#data)
- [diff](layouts_record.RecordInfo.md#diff)
- [flat](layouts_record.RecordInfo.md#flat)
- [keys](layouts_record.RecordInfo.md#keys)
- [meta](layouts_record.RecordInfo.md#meta)
- [prev](layouts_record.RecordInfo.md#prev)
- [type](layouts_record.RecordInfo.md#type)

### Methods

- [expect](layouts_record.RecordInfo.md#expect)
- [initialize](layouts_record.RecordInfo.md#initialize)
- [toFlat](layouts_record.RecordInfo.md#toflat)
- [toFlatDiff](layouts_record.RecordInfo.md#toflatdiff)
- [toJSON](layouts_record.RecordInfo.md#tojson)

## Properties

### acls

• **acls**: [`RecordAcls`](layouts_record.RecordAcls.md)

Accessor to the set of access control list data.

#### Inherited from

[RecordJson](layouts_record.RecordJson.md).[acls](layouts_record.RecordJson.md#acls)

#### Defined in

[src/layouts/record.ts:89](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L89)

___

### data

• **data**: [`RecordData`](layouts_record.RecordData.md)

Accessor to the key/value mapping of record properties with their values.

#### Inherited from

[RecordJson](layouts_record.RecordJson.md).[data](layouts_record.RecordJson.md#data)

#### Defined in

[src/layouts/record.ts:83](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L83)

___

### diff

• **diff**: `Readonly`<`Partial`<[`RecordData`](layouts_record.RecordData.md)\>\>

Accessor to the subset of changed data for this record for this operation.

#### Defined in

[src/layouts/record.ts:98](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L98)

___

### flat

• **flat**: [`RecordFlat`](layouts_record.RecordFlat.md)

Accessor to the flat version of the data, with all namespaces prefixed.

#### Defined in

[src/layouts/record.ts:101](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L101)

___

### keys

• **keys**: `string`[]

Returns the set of record property keys (fully qualified).

#### Defined in

[src/layouts/record.ts:104](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L104)

___

### meta

• **meta**: [`RecordMeta`](layouts_record.RecordMeta.md)

Accessor to the set of timestamp and access information describing this record.

#### Inherited from

[RecordJson](layouts_record.RecordJson.md).[meta](layouts_record.RecordJson.md#meta)

#### Defined in

[src/layouts/record.ts:86](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L86)

___

### prev

• **prev**: `Readonly`<[`RecordData`](layouts_record.RecordData.md)\>

Accessor to the previous version of the data (if any).

#### Defined in

[src/layouts/record.ts:95](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L95)

___

### type

• **type**: `string`

Returns the string name of the parent schema type.

#### Inherited from

[RecordJson](layouts_record.RecordJson.md).[type](layouts_record.RecordJson.md#type)

#### Defined in

[src/layouts/record.ts:80](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L80)

## Methods

### expect

▸ **expect**(`path?`): `Assertion`

Start an expectation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path?` | `string` |

#### Returns

`Assertion`

#### Defined in

[src/layouts/record.ts:116](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L116)

___

### initialize

▸ **initialize**(`flat?`): `void`

Import the original database data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `flat?` | `Readonly`<[`RecordFlat`](layouts_record.RecordFlat.md)\> |

#### Returns

`void`

#### Defined in

[src/layouts/record.ts:119](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L119)

___

### toFlat

▸ **toFlat**(): `Readonly`<[`RecordFlat`](layouts_record.RecordFlat.md)\>

Returns the full flattened record data.

#### Returns

`Readonly`<[`RecordFlat`](layouts_record.RecordFlat.md)\>

#### Defined in

[src/layouts/record.ts:110](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L110)

___

### toFlatDiff

▸ **toFlatDiff**(): `Readonly`<`Partial`<[`RecordFlat`](layouts_record.RecordFlat.md)\>\>

Returns the full flattened record data, but only for changed properties.

#### Returns

`Readonly`<`Partial`<[`RecordFlat`](layouts_record.RecordFlat.md)\>\>

#### Defined in

[src/layouts/record.ts:113](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L113)

___

### toJSON

▸ **toJSON**(): `Readonly`<[`RecordJson`](layouts_record.RecordJson.md)\>

Returns a JSON representation of this record.

#### Returns

`Readonly`<[`RecordJson`](layouts_record.RecordJson.md)\>

#### Defined in

[src/layouts/record.ts:107](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/layouts/record.ts#L107)
