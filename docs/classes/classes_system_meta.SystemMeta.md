[minted-api](../README.md) / [Exports](../modules.md) / [classes/system-meta](../modules/classes_system_meta.md) / SystemMeta

# Class: SystemMeta

[classes/system-meta](../modules/classes_system_meta.md).SystemMeta

## Table of contents

### Constructors

- [constructor](classes_system_meta.SystemMeta.md#constructor)

### Properties

- [\_\_system](classes_system_meta.SystemMeta.md#__system)
- [schemas](classes_system_meta.SystemMeta.md#schemas)

### Methods

- [isSchema](classes_system_meta.SystemMeta.md#isschema)
- [startup](classes_system_meta.SystemMeta.md#startup)
- [toFilter](classes_system_meta.SystemMeta.md#tofilter)
- [toSchema](classes_system_meta.SystemMeta.md#toschema)

## Constructors

### constructor

• **new SystemMeta**(`__system`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__system` | [`System`](classes_system.System.md) |

#### Defined in

[src/classes/system-meta.ts:18](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-meta.ts#L18)

## Properties

### \_\_system

• `Private` `Readonly` **\_\_system**: [`System`](classes_system.System.md)

#### Defined in

[src/classes/system-meta.ts:18](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-meta.ts#L18)

___

### schemas

• `Readonly` **schemas**: `Dictionary`<[`Schema`](classes_schema.Schema.md)\> = `{}`

#### Defined in

[src/classes/system-meta.ts:16](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-meta.ts#L16)

## Methods

### isSchema

▸ **isSchema**(`schema_name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema_name` | `string` |

#### Returns

`boolean`

#### Defined in

[src/classes/system-meta.ts:43](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-meta.ts#L43)

___

### startup

▸ **startup**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/classes/system-meta.ts:20](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-meta.ts#L20)

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

[src/classes/system-meta.ts:65](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-meta.ts#L65)

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

[src/classes/system-meta.ts:47](https://github.com/ianzepp/minted-api-ts/blob/4ef4443/src/classes/system-meta.ts#L47)
