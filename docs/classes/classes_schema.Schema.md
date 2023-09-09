[minted-api](../README.md) / [Exports](../modules.md) / [classes/schema](../modules/classes_schema.md) / Schema

# Class: Schema

[classes/schema](../modules/classes_schema.md).Schema

## Table of contents

### Constructors

- [constructor](classes_schema.Schema.md#constructor)

### Properties

- [columns](classes_schema.Schema.md#columns)
- [source](classes_schema.Schema.md#source)
- [system\_name](classes_schema.Schema.md#system_name)

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

[src/classes/schema.ts:25](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L25)

## Properties

### columns

• `Readonly` **columns**: `Dictionary`<[`Column`](classes_column.Column.md)\> = `{}`

#### Defined in

[src/classes/schema.ts:23](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L23)

___

### source

• `Private` `Readonly` **source**: `Dictionary`<`any`\>

#### Defined in

[src/classes/schema.ts:25](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L25)

___

### system\_name

• `Readonly` **system\_name**: `string`

#### Defined in

[src/classes/schema.ts:22](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L22)

## Accessors

### id

• `get` **id**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/schema.ts:36](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L36)

___

### metadata

• `get` **metadata**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/schema.ts:52](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L52)

___

### ns

• `get` **ns**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/schema.ts:40](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L40)

___

### schema\_name

• `get` **schema_name**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/schema.ts:44](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L44)

___

### schema\_type

• `get` **schema_type**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/schema.ts:48](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L48)

## Methods

### toJSON

▸ **toJSON**(): `Dictionary`<`any`\>

#### Returns

`Dictionary`<`any`\>

#### Defined in

[src/classes/schema.ts:56](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L56)

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

[src/classes/schema.ts:60](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/schema.ts#L60)
