[minted-api](../README.md) / [Exports](../modules.md) / [classes/record](../modules/classes_record.md) / Record

# Class: Record

[classes/record](../modules/classes_record.md).Record

Represents the record's JSON representation in object format.

## Implements

- [`RecordJson`](../interfaces/layouts_record.RecordJson.md)

## Table of contents

### Constructors

- [constructor](classes_record.Record.md#constructor)

### Properties

- [acls](classes_record.Record.md#acls)
- [data](classes_record.Record.md#data)
- [meta](classes_record.Record.md#meta)
- [prev](classes_record.Record.md#prev)
- [schema](classes_record.Record.md#schema)
- [type](classes_record.Record.md#type)
- [ColumnsAcls](classes_record.Record.md#columnsacls)
- [ColumnsInfo](classes_record.Record.md#columnsinfo)

### Accessors

- [diff](classes_record.Record.md#diff)

### Methods

- [expect](classes_record.Record.md#expect)
- [fromRecord](classes_record.Record.md#fromrecord)
- [fromRecordData](classes_record.Record.md#fromrecorddata)
- [fromRecordFlat](classes_record.Record.md#fromrecordflat)
- [fromRecordJson](classes_record.Record.md#fromrecordjson)
- [fromRecordPrev](classes_record.Record.md#fromrecordprev)
- [get](classes_record.Record.md#get)
- [has](classes_record.Record.md#has)
- [set](classes_record.Record.md#set)
- [toJSON](classes_record.Record.md#tojson)
- [toString](classes_record.Record.md#tostring)

## Constructors

### constructor

• **new Record**(`schema`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](classes_schema.Schema.md) |

#### Defined in

[src/classes/record.ts:71](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L71)

## Properties

### acls

• `Readonly` **acls**: [`RecordAcls`](../interfaces/layouts_record.RecordAcls.md)

Accessor to the set of access control list data.

#### Implementation of

[RecordJson](../interfaces/layouts_record.RecordJson.md).[acls](../interfaces/layouts_record.RecordJson.md#acls)

#### Defined in

[src/classes/record.ts:58](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L58)

___

### data

• `Readonly` **data**: [`RecordData`](../interfaces/layouts_record.RecordData.md)

Accessor to the key/value mapping of record properties with their values.

#### Implementation of

[RecordJson](../interfaces/layouts_record.RecordJson.md).[data](../interfaces/layouts_record.RecordJson.md#data)

#### Defined in

[src/classes/record.ts:42](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L42)

___

### meta

• `Readonly` **meta**: [`RecordMeta`](../interfaces/layouts_record.RecordMeta.md)

Accessor to the set of timestamp and access information describing this record.

#### Implementation of

[RecordJson](../interfaces/layouts_record.RecordJson.md).[meta](../interfaces/layouts_record.RecordJson.md#meta)

#### Defined in

[src/classes/record.ts:47](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L47)

___

### prev

• `Readonly` **prev**: [`RecordData`](../interfaces/layouts_record.RecordData.md)

#### Defined in

[src/classes/record.ts:65](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L65)

___

### schema

• `Readonly` **schema**: [`Schema`](classes_schema.Schema.md)

#### Defined in

[src/classes/record.ts:71](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L71)

___

### type

• `Readonly` **type**: `string`

Returns the string name of the parent schema type.

#### Implementation of

[RecordJson](../interfaces/layouts_record.RecordJson.md).[type](../interfaces/layouts_record.RecordJson.md#type)

#### Defined in

[src/classes/record.ts:40](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L40)

___

### ColumnsAcls

▪ `Static` **ColumnsAcls**: `string`[]

#### Defined in

[src/classes/record.ts:33](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L33)

___

### ColumnsInfo

▪ `Static` **ColumnsInfo**: `string`[]

#### Defined in

[src/classes/record.ts:22](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L22)

## Accessors

### diff

• `get` **diff**(): `Partial`<[`RecordData`](../interfaces/layouts_record.RecordData.md)\>

#### Returns

`Partial`<[`RecordData`](../interfaces/layouts_record.RecordData.md)\>

#### Defined in

[src/classes/record.ts:73](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L73)

## Methods

### expect

▸ **expect**(`path?`): `Assertion`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path?` | `string` |

#### Returns

`Assertion`

#### Defined in

[src/classes/record.ts:145](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L145)

___

### fromRecord

▸ **fromRecord**(`source`): [`Record`](classes_record.Record.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`Record`](classes_record.Record.md) |

#### Returns

[`Record`](classes_record.Record.md)

#### Defined in

[src/classes/record.ts:94](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L94)

___

### fromRecordData

▸ **fromRecordData**(`source`): [`Record`](classes_record.Record.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`RecordData`](../interfaces/layouts_record.RecordData.md) |

#### Returns

[`Record`](classes_record.Record.md)

#### Defined in

[src/classes/record.ts:103](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L103)

___

### fromRecordFlat

▸ **fromRecordFlat**(`source`): [`Record`](classes_record.Record.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`RecordFlat`](../interfaces/layouts_record.RecordFlat.md) |

#### Returns

[`Record`](classes_record.Record.md)

#### Defined in

[src/classes/record.ts:117](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L117)

___

### fromRecordJson

▸ **fromRecordJson**(`source`): [`Record`](classes_record.Record.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `Partial`<[`RecordJson`](../interfaces/layouts_record.RecordJson.md)\> |

#### Returns

[`Record`](classes_record.Record.md)

#### Defined in

[src/classes/record.ts:109](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L109)

___

### fromRecordPrev

▸ **fromRecordPrev**(`source`): [`Record`](classes_record.Record.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | [`RecordFlat`](../interfaces/layouts_record.RecordFlat.md) |

#### Returns

[`Record`](classes_record.Record.md)

#### Defined in

[src/classes/record.ts:125](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L125)

___

### get

▸ **get**<`T`\>(`column`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [`Column`](classes_column.Column.md) |

#### Returns

`T`

#### Defined in

[src/classes/record.ts:163](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L163)

___

### has

▸ **has**(`column`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [`Column`](classes_column.Column.md) |

#### Returns

`boolean`

#### Defined in

[src/classes/record.ts:159](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L159)

___

### set

▸ **set**<`T`\>(`column`, `data`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [`Column`](classes_column.Column.md) |
| `data` | `T` |

#### Returns

`void`

#### Defined in

[src/classes/record.ts:167](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L167)

___

### toJSON

▸ **toJSON**(): [`RecordJson`](../interfaces/layouts_record.RecordJson.md)

#### Returns

[`RecordJson`](../interfaces/layouts_record.RecordJson.md)

#### Defined in

[src/classes/record.ts:136](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L136)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/record.ts:132](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/record.ts#L132)
