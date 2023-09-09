[minted-api](../README.md) / [Exports](../modules.md) / [classes/column](../modules/classes_column.md) / Column

# Class: Column

[classes/column](../modules/classes_column.md).Column

## Table of contents

### Constructors

- [constructor](classes_column.Column.md#constructor)

### Properties

- [schema](classes_column.Column.md#schema)
- [source](classes_column.Column.md#source)
- [system\_name](classes_column.Column.md#system_name)

### Accessors

- [audited](classes_column.Column.md#audited)
- [column\_name](classes_column.Column.md#column_name)
- [column\_type](classes_column.Column.md#column_type)
- [id](classes_column.Column.md#id)
- [immutable](classes_column.Column.md#immutable)
- [indexed](classes_column.Column.md#indexed)
- [internal](classes_column.Column.md#internal)
- [maximum](classes_column.Column.md#maximum)
- [minimum](classes_column.Column.md#minimum)
- [ns](classes_column.Column.md#ns)
- [required](classes_column.Column.md#required)
- [schema\_name](classes_column.Column.md#schema_name)
- [unique](classes_column.Column.md#unique)

### Methods

- [toJSON](classes_column.Column.md#tojson)

## Constructors

### constructor

• **new Column**(`source`, `schema`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `Dictionary`<`any`\> |
| `schema` | [`Schema`](classes_schema.Schema.md) |

#### Defined in

[src/classes/column.ts:18](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L18)

## Properties

### schema

• `Readonly` **schema**: [`Schema`](classes_schema.Schema.md)

#### Defined in

[src/classes/column.ts:18](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L18)

___

### source

• `Private` `Readonly` **source**: `Dictionary`<`any`\>

#### Defined in

[src/classes/column.ts:18](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L18)

___

### system\_name

• `Readonly` **system\_name**: `string`

#### Defined in

[src/classes/column.ts:16](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L16)

## Accessors

### audited

• `get` **audited**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/column.ts:60](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L60)

___

### column\_name

• `get` **column_name**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/column.ts:52](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L52)

___

### column\_type

• `get` **column_type**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/column.ts:56](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L56)

___

### id

• `get` **id**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/column.ts:40](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L40)

___

### immutable

• `get` **immutable**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/column.ts:64](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L64)

___

### indexed

• `get` **indexed**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/column.ts:68](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L68)

___

### internal

• `get` **internal**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/column.ts:72](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L72)

___

### maximum

• `get` **maximum**(): `number`

#### Returns

`number`

#### Defined in

[src/classes/column.ts:88](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L88)

___

### minimum

• `get` **minimum**(): `number`

#### Returns

`number`

#### Defined in

[src/classes/column.ts:84](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L84)

___

### ns

• `get` **ns**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/column.ts:44](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L44)

___

### required

• `get` **required**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/column.ts:76](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L76)

___

### schema\_name

• `get` **schema_name**(): `string`

#### Returns

`string`

#### Defined in

[src/classes/column.ts:48](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L48)

___

### unique

• `get` **unique**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/classes/column.ts:80](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L80)

## Methods

### toJSON

▸ **toJSON**(): `Dictionary`<`any`\>

#### Returns

`Dictionary`<`any`\>

#### Defined in

[src/classes/column.ts:92](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/column.ts#L92)
