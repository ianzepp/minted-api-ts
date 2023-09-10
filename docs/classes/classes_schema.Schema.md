[minted-api](../README.md) / [Exports](../modules.md) / [classes/schema](../modules/classes_schema.md) / Schema

# Class: Schema

[classes/schema](../modules/classes_schema.md).Schema

## Table of contents

### Constructors

- [constructor](classes_schema.Schema.md#constructor)

### Properties

- [columns](classes_schema.Schema.md#columns)
- [source](classes_schema.Schema.md#source)

### Accessors

- [id](classes_schema.Schema.md#id)
- [metadata](classes_schema.Schema.md#metadata)
- [ns](classes_schema.Schema.md#ns)
- [schema\_name](classes_schema.Schema.md#schema_name)
- [schema\_type](classes_schema.Schema.md#schema_type)

### Methods

- [toJSON](classes_schema.Schema.md#tojson)
- [toRecord](classes_schema.Schema.md#torecord)

## Constructors

### constructor

• **new Schema**(`source`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `Dictionary`<`any`\> |

#### Defined in

[src/classes/schema.ts:31](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/schema.ts#L31)

## Properties

### columns

• `Readonly` **columns**: `Dictionary`<[`Column`](classes_column.Column.md)\> = `{}`

#### Defined in

[src/classes/schema.ts:29](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/schema.ts#L29)

___

### source

• `Private` `Readonly` **source**: `Dictionary`<`any`\>

#### Defined in

[src/classes/schema.ts:31](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/schema.ts#L31)

## Accessors

### id

• `get` **id**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/schema.ts:37](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/schema.ts#L37)

___

### metadata

• `get` **metadata**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/schema.ts:53](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/schema.ts#L53)

___

### ns

• `get` **ns**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/schema.ts:41](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/schema.ts#L41)

___

### schema\_name

• `get` **schema_name**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/schema.ts:45](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/schema.ts#L45)

___

### schema\_type

• `get` **schema_type**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/schema.ts:49](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/schema.ts#L49)

## Methods

### toJSON

▸ **toJSON**(): `Dictionary`<`any`\>

#### Returns

`Dictionary`<`any`\>

#### Defined in

[src/classes/schema.ts:57](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/schema.ts#L57)

___

### toRecord

▸ **toRecord**(`source?`): [`Record`](classes_record.Record.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source?` | `Dictionary`<`any`\> \| [`RecordFlat`](../interfaces/layouts_record.RecordFlat.md) \| [`RecordData`](../interfaces/layouts_record.RecordData.md) \| [`RecordJson`](../interfaces/layouts_record.RecordJson.md) \| [`Record`](classes_record.Record.md) |

#### Returns

[`Record`](classes_record.Record.md)

#### Defined in

[src/classes/schema.ts:61](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/schema.ts#L61)
