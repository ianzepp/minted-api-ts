[minted-api](../README.md) / [Exports](../modules.md) / [classes/schema](../modules/classes_schema.md) / Schema

# Class: Schema

[classes/schema](../modules/classes_schema.md).Schema

## Table of contents

### Constructors

- [constructor](classes_schema.Schema.md#constructor)

### Properties

- [columns](classes_schema.Schema.md#columns)
- [id](classes_schema.Schema.md#id)
- [metadata](classes_schema.Schema.md#metadata)
- [ns](classes_schema.Schema.md#ns)
- [schema\_name](classes_schema.Schema.md#schema_name)
- [schema\_type](classes_schema.Schema.md#schema_type)

### Methods

- [column\_keys](classes_schema.Schema.md#column_keys)
- [is](classes_schema.Schema.md#is)
- [isRecordDict](classes_schema.Schema.md#isrecorddict)
- [isRecordFlat](classes_schema.Schema.md#isrecordflat)
- [isRecordJson](classes_schema.Schema.md#isrecordjson)
- [toRecord](classes_schema.Schema.md#torecord)

## Constructors

### constructor

• **new Schema**(`flat`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `flat` | `Dictionary`<`any`\> |

#### Defined in

[src/classes/schema.ts:28](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L28)

## Properties

### columns

• `Readonly` **columns**: `Map`<`string`, [`Column`](classes_column.Column.md)\>

#### Defined in

[src/classes/schema.ts:18](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L18)

___

### id

• `Readonly` **id**: `string`

#### Defined in

[src/classes/schema.ts:21](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L21)

___

### metadata

• `Readonly` **metadata**: `boolean`

#### Defined in

[src/classes/schema.ts:26](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L26)

___

### ns

• `Readonly` **ns**: `string`

#### Defined in

[src/classes/schema.ts:22](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L22)

___

### schema\_name

• `Readonly` **schema\_name**: `string`

#### Defined in

[src/classes/schema.ts:24](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L24)

___

### schema\_type

• `Readonly` **schema\_type**: `string`

#### Defined in

[src/classes/schema.ts:25](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L25)

## Methods

### column\_keys

▸ **column_keys**(`prefix?`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `prefix?` | `string` |

#### Returns

`string`[]

#### Defined in

[src/classes/schema.ts:37](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L37)

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

[src/classes/schema.ts:43](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L43)

___

### isRecordDict

▸ **isRecordDict**(`source`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `unknown` |

#### Returns

`boolean`

#### Defined in

[src/classes/schema.ts:81](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L81)

___

### isRecordFlat

▸ **isRecordFlat**(`source`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `unknown` |

#### Returns

`boolean`

#### Defined in

[src/classes/schema.ts:91](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L91)

___

### isRecordJson

▸ **isRecordJson**(`source`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `unknown` |

#### Returns

`boolean`

#### Defined in

[src/classes/schema.ts:85](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L85)

___

### toRecord

▸ **toRecord**(`source?`): [`Record`](classes_record.Record.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source?` | `any` |

#### Returns

[`Record`](classes_record.Record.md)

#### Defined in

[src/classes/schema.ts:47](https://github.com/ianzepp/minted-api-ts/blob/ce6db2f/src/classes/schema.ts#L47)
