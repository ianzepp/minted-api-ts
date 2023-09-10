[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-meta](../modules/classes_system_meta.md) / SystemMeta

# Class: SystemMeta

[classes/system-meta](../modules/classes_system_meta.md).SystemMeta

## Implements

- [`SystemService`](../interfaces/classes_system.SystemService.md)

## Table of contents

### Constructors

- [constructor](classes_system_meta.SystemMeta.md#constructor)

### Properties

- [columns](classes_system_meta.SystemMeta.md#columns)
- [schemas](classes_system_meta.SystemMeta.md#schemas)
- [system](classes_system_meta.SystemMeta.md#system)

### Methods

- [cleanup](classes_system_meta.SystemMeta.md#cleanup)
- [refresh](classes_system_meta.SystemMeta.md#refresh)
- [startup](classes_system_meta.SystemMeta.md#startup)
- [toFilter](classes_system_meta.SystemMeta.md#tofilter)
- [toSchema](classes_system_meta.SystemMeta.md#toschema)

## Constructors

### constructor

• **new SystemMeta**(`system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-meta.ts:24](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system-meta.ts#L24)

## Properties

### columns

• `Readonly` **columns**: `Dictionary`<[`Column`](classes_column.Column.md)\> = `{}`

#### Defined in

[src/classes/system-meta.ts:22](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system-meta.ts#L22)

___

### schemas

• `Readonly` **schemas**: `Dictionary`<[`Schema`](classes_schema.Schema.md)\> = `{}`

#### Defined in

[src/classes/system-meta.ts:21](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system-meta.ts#L21)

___

### system

• `Private` `Readonly` **system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-meta.ts:24](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system-meta.ts#L24)

## Methods

### cleanup

▸ **cleanup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[cleanup](../interfaces/classes_system.SystemService.md#cleanup)

#### Defined in

[src/classes/system-meta.ts:56](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system-meta.ts#L56)

___

### refresh

▸ **refresh**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-meta.ts:62](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system-meta.ts#L62)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Implementation of

[SystemService](../interfaces/classes_system.SystemService.md).[startup](../interfaces/classes_system.SystemService.md#startup)

#### Defined in

[src/classes/system-meta.ts:26](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system-meta.ts#L26)

___

### toFilter

▸ **toFilter**(`schema_name`, `filter_data`): [`Filter`](classes_filter.Filter.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |
| `filter_data` | `Dictionary`<`any`\> |

#### Returns

[`Filter`](classes_filter.Filter.md)

#### Defined in

[src/classes/system-meta.ts:94](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system-meta.ts#L94)

___

### toSchema

▸ **toSchema**(`schema_name`): [`Schema`](classes_schema.Schema.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` \| [`Schema`](classes_schema.Schema.md) |

#### Returns

[`Schema`](classes_schema.Schema.md)

#### Defined in

[src/classes/system-meta.ts:67](https://github.com/ianzepp/minted-api-ts/blob/d1e72a6/src/classes/system-meta.ts#L67)
