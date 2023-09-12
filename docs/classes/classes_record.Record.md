[minted-api](../README.md) / [Exports](../modules.md) / [classes/record](../modules/classes_record.md) / Record

# Class: Record

[classes/record](../modules/classes_record.md).Record

## Table of contents

### Constructors

- [constructor](classes_record.Record.md#constructor)

### Properties

- [data](classes_record.Record.md#data)
- [meta](classes_record.Record.md#meta)
- [prev](classes_record.Record.md#prev)
- [schema](classes_record.Record.md#schema)
- [type](classes_record.Record.md#type)

### Accessors

- [created](classes_record.Record.md#created)
- [diff](classes_record.Record.md#diff)
- [expired](classes_record.Record.md#expired)
- [updated](classes_record.Record.md#updated)

### Methods

- [get](classes_record.Record.md#get)
- [has](classes_record.Record.md#has)
- [is](classes_record.Record.md#is)
- [old](classes_record.Record.md#old)
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

[src/classes/record.ts:110](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L110)

## Properties

### data

• `Readonly` **data**: `Dictionary`<`any`\>

#### Defined in

[src/classes/record.ts:105](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L105)

___

### meta

• `Readonly` **meta**: `Dictionary`<`any`\>

#### Defined in

[src/classes/record.ts:107](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L107)

___

### prev

• `Readonly` **prev**: `Dictionary`<`any`\>

#### Defined in

[src/classes/record.ts:106](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L106)

___

### schema

• `Readonly` **schema**: [`Schema`](classes_schema.Schema.md)

#### Defined in

[src/classes/record.ts:110](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L110)

___

### type

• `Readonly` **type**: `string`

#### Defined in

[src/classes/record.ts:102](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L102)

## Accessors

### created

• `get` **created**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/record.ts:136](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L136)

___

### diff

• `get` **diff**(): `Dictionary`<`any`\>

#### Returns

`Dictionary`<`any`\>

#### Defined in

[src/classes/record.ts:116](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L116)

___

### expired

• `get` **expired**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/record.ts:144](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L144)

___

### updated

• `get` **updated**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/record.ts:140](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L140)

## Methods

### get

▸ **get**(`column`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [`Column`](classes_column.Column.md) |

#### Returns

`any`

#### Defined in

[src/classes/record.ts:168](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L168)

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

[src/classes/record.ts:163](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L163)

___

### is

▸ **is**(`schema_name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` |

#### Returns

`boolean`

#### Defined in

[src/classes/record.ts:159](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L159)

___

### old

▸ **old**(`column`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [`Column`](classes_column.Column.md) |

#### Returns

`any`

#### Defined in

[src/classes/record.ts:172](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L172)

___

### set

▸ **set**(`column`, `data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [`Column`](classes_column.Column.md) |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[src/classes/record.ts:176](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L176)

___

### toJSON

▸ **toJSON**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | `Dictionary`<`any`\> |
| `meta` | `Dictionary`<`any`\> |

#### Defined in

[src/classes/record.ts:152](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L152)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/record.ts:148](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/record.ts#L148)
